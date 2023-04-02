import { _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'

test('launch app', async () => {
  const electronApp = await electron.launch({ args: ['./out/main/index.js'] })
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    // This runs in Electron's main process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.isPackaged
  })

  expect(isPackaged).toBe(false)

  // Wait for the first BrowserWindow to open
  // and return its Page object
  const window = await electronApp.firstWindow()

  await new Promise((resolve) => {
    setInterval(() => {
      resolve()
    }, 10000)
  })

  // close app
  await electronApp.close()
})
