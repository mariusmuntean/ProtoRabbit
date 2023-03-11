import { IpcRenderer } from 'electron'
import { SendableMessageTemplate } from 'src/shared/SendableMessageTemplate'
import { IpcChannels } from '../shared/IpcChannels'

export class ProtoRabbitSettings {
  readonly serverSettings: ServerSettings
  readonly sendSettings: SendSettings

  public constructor(ipcRenderer: IpcRenderer) {
    this.serverSettings = new ServerSettings(ipcRenderer)
    this.sendSettings = new SendSettings(ipcRenderer)
  }
}

export class ServerSettings {
  _ipcRenderer: IpcRenderer

  public constructor(ipcRenderer: IpcRenderer) {
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
}

export class SendSettings {
  _ipcRenderer: IpcRenderer

  public constructor(ipcRenderer: IpcRenderer) {
    this._ipcRenderer = ipcRenderer
  }

  getSendableMessageTemplates = async (): Promise<SendableMessageTemplate[]> => {
    const sendableMessageTemplates = await this._ipcRenderer.invoke(IpcChannels.ReadStoreKey, 'sendableMessageTemplates')
    return sendableMessageTemplates
  }
  setSendableMessageTemplates = async (sendableMessageTemplates: SendableMessageTemplate[]): Promise<void> => {
    await this._ipcRenderer.invoke(IpcChannels.WriteStoreKey, ['sendableMessageTemplates', sendableMessageTemplates])
  }

  getSelectedSendableMessageTemplateId = async (): Promise<string> => {
    const selectedSendableMessageTemplateId = await this._ipcRenderer.invoke(IpcChannels.ReadStoreKey, 'selectedSendableMessageTemplateId')
    return selectedSendableMessageTemplateId
  }
  setSelectedSendableMessageTemplateId = async (id: string[]): Promise<void> => {
    await this._ipcRenderer.invoke(IpcChannels.WriteStoreKey, ['selectedSendableMessageTemplateId', id])
  }
}
