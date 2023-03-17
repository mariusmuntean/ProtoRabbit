import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib'

import { ProtoRabbitSettings } from './ProtoRabbitSettings'
import { IpcChannels } from '../shared/IpcChannels'
import { ProtoRabbitDataStore } from './ProtoRabbitDataStore'
import { getProtobufMessageType } from './../shared/ProtofileUtil'
import { Subscription } from '../shared/Subscription'

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
    try {
      const msgType = getProtobufMessageType(protoFileContent)

      // Check message
      console.log('Checking ' + msg)
      const msgObj = JSON.parse(msg)
      const failureReason = msgType.verify(msgObj)

      if (failureReason) {
        console.log(failureReason)
        throw new Error(failureReason)
      }

      // Send message
      const protobufMessage = msgType.create(msgObj)
      const msgUin8Array = msgType.encode(protobufMessage).finish()
      channel?.publish(exchange, routingKey, Buffer.from(msgUin8Array))
      console.log('Published proto message: ', msgUin8Array)
      console.log('Published json message', msg)
    } catch (error) {
      console.log(error)
    }
  },

  settings: new ProtoRabbitSettings(ipcRenderer),
  dataStore: new ProtoRabbitDataStore(ipcRenderer),

  addNewSubscription: async (
    name: string,
    exchange: string,
    routingKey: string,
    queueName: string,
    protofileData: string
  ): Promise<Subscription> => {
    const assertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: true })
    const reply = channel.bindQueue(queueName, exchange, routingKey)

    const msgType = getProtobufMessageType(protofileData)
    const sub = new Subscription(name, exchange, routingKey, queueName, msgType)
    const consume = await channel.consume(queueName, sub.addRabbitMqMessage)
    sub.consumerTag = consume.consumerTag
    console.log('New sub', sub)

    return sub
  },

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
