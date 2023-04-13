import { _electron as electron } from 'playwright'
import { expect, test } from '@playwright/test'
import { ConnectionSection } from './page objects/ConnectionSection'
import { SendSection } from './page objects/SendSection'
import { ulid } from 'ulid'
import { AppInfoPageObject } from './page objects/AppInfoPageObject'
import { ActiveSubscription, ReceiveSection } from './page objects/ReceiveSection'

test('Create new sendable message template', async ({ page }, i) => {
  // Given that ProtoRabbit is running ...
  const electronApp = await electron.launch({ args: ['./out/main/index.js'], executablePath: './node_modules/.bin/electron' })
  const window = await electronApp.firstWindow()

  // ... without any configuration
  const appInfoPageObj = new AppInfoPageObject(window)
  await appInfoPageObj.deleteAppConfigFile()

  // When I try to connect to the default RabbitMQ server, then the connection is established
  const connectionSection = new ConnectionSection(window)
  await connectionSection.connect()

  // When I open the modal for adding a new sendable message template
  const sendSection = new SendSection(window)
  await sendSection.openNewSendableMessageTemplate()

  // And I enter all the data
  const newTemplateName = 'New user' + ulid()
  const exchange = 'proto.data'
  const routingKey = 'n'
  const protofile = `package ProtoRabbit;
syntax = "proto3";

message AwesomeMessage {
  string user_id = 1;
}`
  const messageJson = `{ "user_id": "123-xd-88" }`
  await sendSection.createNewSendableMessageTemplate(newTemplateName, exchange, routingKey, protofile, messageJson)

  // Then a new sendable message template is available in the dropdown ...
  const sendableMessageTemplates = await sendSection.getSendableMessageTemplates()
  expect(sendableMessageTemplates).toContain(newTemplateName)

  // ... and can be selected
  await sendSection.selectSendableMessageTemplateByName(newTemplateName)
  const currentSendableMessageTemplate = await sendSection.getSelectedSendableMessageTemplate()
  expect(currentSendableMessageTemplate?.name).toBe(newTemplateName)
  expect(currentSendableMessageTemplate?.exchange).toBe(exchange)
  expect(currentSendableMessageTemplate?.routingKey).toBe(routingKey)
  expect(currentSendableMessageTemplate?.protofile).toBe(protofile)
  expect(currentSendableMessageTemplate?.messageJson).toBe(messageJson)

  await window.close()
  await electronApp.close()
  await page.close()
})

test('Send new message', async ({ page }, i) => {
  // Given that ProtoRabbit is running ...
  const electronApp = await electron.launch({ args: ['./out/main/index.js'], executablePath: './node_modules/.bin/electron' })
  const window = await electronApp.firstWindow()

  // ... without any configuration ...
  const appInfoPageObj = new AppInfoPageObject(window)
  await appInfoPageObj.deleteAppConfigFile()

  // ... and a connection is established to RabbitMQ ...
  const connectionSection = new ConnectionSection(window)
  await connectionSection.connect()

  // ... and a sendable message template is created
  const sendSection = new SendSection(window)
  await sendSection.openNewSendableMessageTemplate()

  const newTemplateName = 'New user' + ulid()
  const exchange = 'proto.data'
  const routingKey = 'n'
  const protofile = `package ProtoRabbit;
syntax = "proto3";

message CreateUser {
  string user_id = 1;
  string user_name = 2;
  string user_email = 3;
}`
  const messageJson = `{ "user_id": "123-xd-88", "user_name": "someone", "user_email": "someone@test.com" }`
  await sendSection.createNewSendableMessageTemplate(newTemplateName, exchange, routingKey, protofile, messageJson)
  await sendSection.selectSendableMessageTemplateByName(newTemplateName)

  // When I create a new subscription
  const receiveSection = new ReceiveSection(window)
  await receiveSection.openNewSubscriptionModal()
  const newSubscriptionName = 'Some subscription'
  await receiveSection.createNewSubscription(newSubscriptionName, exchange, routingKey, 'some_queue', protofile)

  const activeSubscriptions = await receiveSection.getSubscriptions()
  expect(activeSubscriptions[0].name).toBe(newSubscriptionName)
  expect(activeSubscriptions[0].exchange).toBe(exchange)
  expect(activeSubscriptions[0].routingKey).toBe(routingKey)
  expect(activeSubscriptions[0].isSelected).toBe(false)

  await window.close()
  await electronApp.close()
  await page.close()
})
