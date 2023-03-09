import { ProtoRabbitSettings } from './../shared/ProtoRabbitSettings'
import { IpcChannels } from '../shared/IpcChannels'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { connect, Connection, Channel } from 'amqplib'
import { load } from 'protobufjs'

// Custom APIs for renderer
export interface ConnectionOptions {
  /**
   * The to be used protocol
   *
   * Default value: 'amqp'
   */
  protocol?: string | undefined

  /**
   * Hostname used for connecting to the server.
   *
   * Default value: 'localhost'
   */
  hostname?: string | undefined
  /**
   * Port used for connecting to the server.
   *
   * Default value: 5672
   */
  port?: number | undefined
  /**
   * Username used for authenticating against the server.
   *
   * Default value: 'guest'
   */
  username?: string | undefined
  /**
   * Password used for authenticating against the server.
   *
   * Default value: 'guest'
   */
  password?: string | undefined
}
let conn: Connection
let channel: Channel

let connectionStatusListener: (isConnected: boolean) => void
type connectionStatusListenerType = typeof connectionStatusListener
let connectionStatusListeners: connectionStatusListenerType[] = []

const api = {
  connect: async ({
    protocol = 'amqp',
    hostname = 'localhost',
    port = 5672,
    username = 'guest',
    password = 'guest'
  }: ConnectionOptions) => {
    if (conn) {
      conn.close()
    }
    const connectionOptions: ConnectionOptions = {
      protocol,
      hostname,
      port,
      username,
      password
    }
    console.log(connectionOptions)
    conn = await connect(connectionOptions)
    console.log('Connected')
    channel = await conn.createChannel()

    connectionStatusListeners.forEach((l) => l(true))
    conn.on('close', (args) => {
      console.log('Connection closed')
      return connectionStatusListeners.forEach((l) => l(false))
    })
    conn.on('error', (args) => {
      console.log('Connection error')
      return connectionStatusListeners.forEach((l) => l(false))
    })
  },
  addConnectionStatusChangeListener: (listener: connectionStatusListenerType) => connectionStatusListeners.push(listener),
  removeConnectionStatusChangeListener: (listener: connectionStatusListenerType) =>
    (connectionStatusListeners = [...connectionStatusListeners.filter((l) => l != listener)]),

  disconnect: () => conn?.close(),

  send: async (exchange: string, routingKey: string, protoFileContent: string, msg: string) => {
    // Get the temp protofile path
    const tempProtoFilePath: string = await ipcRenderer.invoke('write-to-temp-file', ['x.proto', protoFileContent])
    console.log(tempProtoFilePath)

    // Determine package and message name
    const lines = protoFileContent.split('\n')
    const packageName = lines
      .find((l) => l.startsWith('package'))
      ?.split(' ')?.[1]
      ?.replace(';', '')
    console.log('Package name: ' + packageName)

    const messageName = lines
      .map((l) => l.trim())
      .find((l) => l.includes('message'))
      ?.split(' ')?.[1]
      ?.replace(';', '')
    if (!messageName) throw new Error('cannot find message')
    console.log('Message name: ' + messageName)

    try {
      const { root } = await load(tempProtoFilePath)
      const msgType = root.lookupType(packageName ? `${packageName}.${messageName}` : messageName)
      console.log('Checking ' + msg)
      const msgObj = JSON.parse(msg)
      const failureReason = msgType.verify(msgObj)

      if (failureReason) {
        console.log(failureReason)
        throw new Error(failureReason)
      }

      const protobufMessage = msgType.create(msgObj)
      const msgUin8Array = msgType.encode(protobufMessage).finish()
      console.log(msgUin8Array)

      channel?.publish(exchange, routingKey, Buffer.from(msgUin8Array))
      console.log('Published msg', msg)
    } catch (error) {
      console.log(error)
    }

    // return channel?.publish(exchange, routingKey, Buffer.from(msg))
  },

  settings: new ProtoRabbitSettings(ipcRenderer),

  version: (): string => ipcRenderer.sendSync(IpcChannels.AppVersionChannel),
  name: (): string => ipcRenderer.sendSync(IpcChannels.AppNameChannel)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('ProtoRabbit', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type ProtoRabbit = typeof api
