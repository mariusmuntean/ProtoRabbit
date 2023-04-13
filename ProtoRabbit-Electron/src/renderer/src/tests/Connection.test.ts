import { _electron as electron } from 'playwright'
import { expect, test } from '@playwright/test'
import { ConnectionSection } from './page objects/ConnectionSection'

test('Connect and disconnect', async ({ page }, i) => {
  // Given that ProtoRabbit is started
  const electronApp = await electron.launch({ args: ['./out/main/index.js'], executablePath: './node_modules/.bin/electron' })
  const window = await electronApp.firstWindow()

  // When I try to connect to the default RabbitMQ server, then the connection is established
  const connectionSection = new ConnectionSection(window)
  await connectionSection.connect()

  // When I click 'disconnect' then the connection is closed
  await connectionSection.disconnect()

  // And the 'disconnect' button isn't visible anymore
  await expect(window.getByRole('button', { name: 'Disconnect' })).not.toBeVisible()

  await window.close()
  await electronApp.close()
})

test('Connect to wrong host', async ({ page }, i) => {
  // Given that ProtoRabbit is started
  const electronApp = await electron.launch({ args: ['./out/main/index.js'], executablePath: './node_modules/.bin/electron' })
  const window = await electronApp.firstWindow()

  // When I try to connect to an unknown RabbitMQ server
  const connectionSection = new ConnectionSection(window)
  await connectionSection.connect('some host, idk')

  // Then I can't connect and hence the 'disconnect' button is not visible
  const disconnectBtn = window.getByRole('button', { name: 'Disconnect' })
  await expect(disconnectBtn).not.toBeVisible()

  // But an error notification is shown
  const errorNotification = window
    .locator('div')
    .filter({ hasText: 'Connection failed{"cause":{},"isOperational":true,"errno":-3008,"code":"ENOTFOUN' })
    .nth(1)
  await expect(errorNotification).toBeVisible()

  await window.close()
  await electronApp.close()
})
