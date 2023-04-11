import { _electron as electron } from 'playwright'
import { expect, test } from '@playwright/test'

test('launch app', async ({ page }, i) => {
  // console.log(process.env)
  // console.log(process.cwd())
  const electronApp = await electron.launch({ args: ['./out/main/index.js'], executablePath: './node_modules/.bin/electron' })
  const window = await electronApp.firstWindow()

  const connectBtn = window.getByRole('button', { name: 'Connect' })
  await connectBtn.click()

  const disconnectBtn = window.getByRole('button', { name: 'Disconnect' })
  await disconnectBtn.click()

  await expect(window.getByRole('button', { name: 'Disconnect' })).not.toBeVisible()

  await window.close()
})
