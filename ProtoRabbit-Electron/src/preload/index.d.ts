import { ElectronAPI } from '@electron-toolkit/preload'
import { MYAPI } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    MYAPI: MYAPI
  }
}
