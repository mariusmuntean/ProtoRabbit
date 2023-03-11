import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import Store from 'electron-store'

import icon from '../../resources/icon.png?asset'
import { IpcChannels } from '../shared/IpcChannels'
import { ulid } from 'ulid'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 1400,
    x: 2500,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true
      // contextIsolation: true,
      // nodeIntegration: false
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on(IpcChannels.AppVersionChannel, (e, args) => {
  e.returnValue = app.getVersion()
})
ipcMain.on(IpcChannels.AppNameChannel, (e, args) => {
  e.returnValue = app.getName()
})

ipcMain.handle(IpcChannels.WriteToTempFile, (e, args) => {
  const protoFileName = args[0]
  const protoFileContent = args[1]
  const protoFilePath = join(app.getPath('temp'), protoFileName)

  fs.writeFile(protoFilePath, protoFileContent, { encoding: 'utf8', flag: 'w' }, (e) => {})

  return Promise.resolve(protoFilePath)
})

const appStore = new Store({
  migrations: {
    '0.1.1': (store) => {
      if (!store.has('sendableMessageTemplates')) {
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendableMessageTemplates = store.get('sendableMessageTemplates') as any[]
      if (!sendableMessageTemplates || sendableMessageTemplates.length === 0) {
        return
      }
      sendableMessageTemplates?.forEach((template) => {
        template.id = template.id ?? ulid()
      })
      store.set('sendableMessageTemplates', sendableMessageTemplates)
    }
  }
})
ipcMain.handle(IpcChannels.WriteStoreKey, (e, args) => {
  const key = args[0]
  const value = args[1]
  appStore.set(key, value)
  return Promise.resolve()
})
ipcMain.handle(IpcChannels.ReadStoreKey, (e, args) => {
  const key = args
  return Promise.resolve(appStore.get(key))
})
