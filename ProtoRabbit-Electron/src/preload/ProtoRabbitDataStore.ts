import { IpcChannels } from './../shared/IpcChannels'
import { IpcRenderer } from 'electron'

export class ProtoRabbitDataStore {
  private readonly _ipcRenderer: IpcRenderer

  constructor(ipcRenderer: IpcRenderer) {
    this._ipcRenderer = ipcRenderer
  }

  getDataStorePath = async (): Promise<string> => {
    return await this._ipcRenderer.invoke(IpcChannels.GetDataStorePath)
  }

  getDataStoreContent = async (): Promise<string> => {
    return await this._ipcRenderer.invoke(IpcChannels.GetDataStoreContent)
  }

  openDataStoreInUserEditor = async (): Promise<string> => {
    return await this._ipcRenderer.invoke(IpcChannels.OpenDataStoreInUserEditor)
  }
}
