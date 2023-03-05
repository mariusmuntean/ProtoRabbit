import { IpcChannels } from './../shared'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { connect, Connection, Channel } from 'amqplib'

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
  addConnectionStatusChangeListener: (listener: connectionStatusListenerType) =>
    connectionStatusListeners.push(listener),
  removeConnectionStatusChangeListener: (listener: connectionStatusListenerType) =>
    (connectionStatusListeners = [...connectionStatusListeners.filter((l) => l != listener)]),

  disconnect: () => conn?.close(),

  send: (msg: string) => channel?.publish('proto.data', 'create', Buffer.from(msg)),
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
