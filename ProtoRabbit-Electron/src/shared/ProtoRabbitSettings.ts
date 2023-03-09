import { IpcRenderer } from 'electron'
import { IpcChannels } from './IpcChannels'

export class ServerSettings {
  _ipcRenderer: Electron.IpcRenderer

  public constructor(ipcRenderer: Electron.IpcRenderer) {
    this._ipcRenderer = ipcRenderer
  }

  getHost = async (): Promise<string> => {
    return await this._ipcRenderer.invoke(IpcChannels.ReadStoreKey, 'host')
  }
  setHost = async (host: string): Promise<void> => {
    await this._ipcRenderer.invoke(IpcChannels.WriteStoreKey, ['host', host])
  }

  getPort = async (): Promise<number> => {
    return await this._ipcRenderer.invoke(IpcChannels.ReadStoreKey, 'port')
  }
  setPort = async (port: number): Promise<void> => {
    await this._ipcRenderer.invoke(IpcChannels.WriteStoreKey, ['port', port])
  }

  getUsername = async (): Promise<string> => {
    return await this._ipcRenderer.invoke(IpcChannels.ReadStoreKey, 'username')
  }
  setUsername = async (host: string): Promise<void> => {
    await this._ipcRenderer.invoke(IpcChannels.WriteStoreKey, ['username', host])
  }

  getPassword = async (): Promise<string> => {
    return await this._ipcRenderer.invoke(IpcChannels.ReadStoreKey, 'password')
  }
  setPassword = async (password: string): Promise<void> => {
    await this._ipcRenderer.invoke(IpcChannels.WriteStoreKey, ['password', password])
  }

  // port: string,
  // username: string,
  // password: string
}

export class ProtoRabbitSettings {
  readonly serverSettings: ServerSettings

  public constructor(ipcRenderer: IpcRenderer) {
    this.serverSettings = new ServerSettings(ipcRenderer)
  }
}
