import { _electron as electron } from 'playwright'
import { test } from '@playwright/test'

test('launch app', async ({ page }, i) => {
  const electronApp = await electron.launch({ args: ['./../../../out/main/index.js'] })
  const window = await electronApp.firstWindow()

  const connectBtn = window.getByRole('button', { name: 'Connect' })
  await connectBtn.click()

  const disconnectBtn = window.getByRole('button', { name: 'Disconnect' })
  await disconnectBtn.click()

  await window.close()
})
