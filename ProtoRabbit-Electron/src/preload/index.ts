import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { connect, Connection, Channel } from 'amqplib'

import { ProtoRabbitSettings } from './ProtoRabbitSettings'
import { IpcChannels } from '../shared/IpcChannels'
import { ProtoRabbitDataStore } from './ProtoRabbitDataStore'
import { getProtobufMessageType } from './../shared/ProtofileUtil'
import { SubscriptionManager } from './SubscriptionManager'

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
let conn: Connection | undefined
let channel: Channel | undefined
let isConnected = false

let connectionStatusListener: (isConnected: boolean) => void
type connectionStatusListenerType = typeof connectionStatusListener
let connectionStatusListeners: connectionStatusListenerType[] = []

let subscriptionManager: SubscriptionManager | undefined = undefined

const api = {
  connect: async ({
    protocol = 'amqp',
    hostname = 'localhost',
    port = 5672,
    username = 'guest',
    password = 'guest'
  }: ConnectionOptions) => {
    const connectionOptions: ConnectionOptions = {
      protocol,
      hostname,
      port,
      username,
      password
    }
    conn = await connect(connectionOptions)
    channel = await conn.createChannel()

    isConnected = true
    connectionStatusListeners.forEach((l) => l(true))

    conn.on('connection', (_args) => {
      isConnected = true
      connectionStatusListeners.forEach((l) => l(false))
    })
    conn.on('close', (_args) => {
      isConnected = false
      connectionStatusListeners.forEach((l) => l(false))
    })
    conn.on('error', (_args) => {
      connectionStatusListeners.forEach((l) => l(false))
    })

    // It is important to disconnect when the window is reloaded. Otherwise the old connection lingers on and a new one cannot be established, i.e. calling await connect(...) never returns
    window.onbeforeunload = async (e) => {
      console.log('About to reload ', e)
      await channel?.close()
      channel = undefined
      await conn?.close()
      conn = undefined
    }

    subscriptionManager = new SubscriptionManager(channel)
  },
  addConnectionStatusChangeListener: (listener: connectionStatusListenerType) => connectionStatusListeners.push(listener),
  removeConnectionStatusChangeListener: (listener: connectionStatusListenerType) =>
    (connectionStatusListeners = [...connectionStatusListeners.filter((l) => l != listener)]),

  disconnect: () => conn?.close(),
  isConnected: isConnected,

  send: async (exchange: string, routingKey: string, protoFileContent: string, msg: string) => {
    try {
      const msgType = getProtobufMessageType(protoFileContent)

      // Check message
      const msgObj = JSON.parse(msg)
      const failureReason = msgType.verify(msgObj)

      if (failureReason) {
        throw new Error(failureReason)
      }

      // Send message
      const protobufMessage = msgType.create(msgObj)
      const msgUin8Array = msgType.encode(protobufMessage).finish()
      channel?.publish(exchange, routingKey, Buffer.from(msgUin8Array))
    } catch (error) {
      console.log(error)
    }
  },

  settings: new ProtoRabbitSettings(ipcRenderer),
  dataStore: new ProtoRabbitDataStore(ipcRenderer),

  getSubscriptionManager: () => subscriptionManager,

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
