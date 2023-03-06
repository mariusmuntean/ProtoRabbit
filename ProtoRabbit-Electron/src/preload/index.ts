import { IpcChannels } from './../shared'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { connect, Connection, Channel } from 'amqplib'
import { load } from 'protobufjs'

// Custom APIs for renderer
let conn: Connection
let channel: Channel

let connectionStatusListener: (isConnected: boolean) => void
type connectionStatusListenerType = typeof connectionStatusListener
let connectionStatusListeners: connectionStatusListenerType[] = []

const api = {
  connect: async () => {
    if (conn) {
      conn.close()
    }

    conn = await connect('amqp://localhost')
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

  do: async () => await ipcRenderer.invoke('invoke-channel', { name: 'Marius' }),
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
