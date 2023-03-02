import { IpcChannels } from './../shared'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { connect, Connection, Channel } from 'amqplib'

// Custom APIs for renderer
let conn: Connection
let channel: Channel

const api = {
  connect: async () => {
    conn = await connect('amqp://localhost')
    channel = await conn.createChannel()
  },
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
    contextBridge.exposeInMainWorld('MYAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type MYAPI = typeof api
