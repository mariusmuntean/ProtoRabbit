import { ElectronAPI } from '@electron-toolkit/preload'
import { ProtoRabbit } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    ProtoRabbit: ProtoRabbit
  }
}
