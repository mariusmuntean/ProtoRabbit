import { _electron as electron } from 'playwright'
import { test } from '@playwright/test'
import { ConnectionSection } from './page objects/ConnectionSection'
import { SendSection } from './page objects/SendSection'

test('Create new sendable message template', async ({ page }, i) => {
  // Given that ProtoRabbit is started
  const electronApp = await electron.launch({ args: ['./out/main/index.js'], executablePath: './node_modules/.bin/electron' })
  const window = await electronApp.firstWindow()

  // When I try to connect to the default RabbitMQ server, then the connection is established
  const connectionSection = new ConnectionSection(window)
  await connectionSection.connect()

  const sendSection = new SendSection(window)
  await sendSection.openNewSendableMessageTemplate()
  await sendSection.createNewSendableMessageTemplate(
    'New user',
    'proto.data',
    'n',
    `package ProtoRabbit;
  syntax = "proto3";

  message AwesomeMessage {
      string user_id = 1; // becomes userId
  }`,
    `{ "userId": "123-xd-88" }`
  )

  await window.close()
})
