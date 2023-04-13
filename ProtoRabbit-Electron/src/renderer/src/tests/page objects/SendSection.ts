import { expect } from '@playwright/test'
import { Locator, Page } from 'playwright'
import os from 'os'

export class SendSection {
  private readonly _window: Page

  constructor(window: Page) {
    this._window = window
  }

  public async openNewSendableMessageTemplate() {
    const upsertSendableMessageBtn = this._window.locator('#createSendableMessageBtn')
    await expect(upsertSendableMessageBtn).toBeVisible()
    await upsertSendableMessageBtn.click()

    await this.openNewMessageModal()
  }

  public async createNewSendableMessageTemplate(
    templateName: string,
    exchange: string,
    routingKey: string,
    protofile: string,
    messageSampleJson: string | undefined
  ) {
    await this.openNewMessageModal()

    const modal = await this.openNewMessageModal()

    await this.setTemplateName(modal, templateName)
    await this.setExchange(modal, exchange)
    await this.setRoutingKey(modal, routingKey)
    await this.setProtofile(modal, protofile)
    await this.setSampleJson(modal, messageSampleJson)

    await this.clickCreate(modal)
  }

  public async getSendableMessageTemplates(): Promise<string[]> {
    const templateSelect = await this.getSendableMessageTemplateSelect()
    await templateSelect.click()

    const templateNames = await this._window.locator('.ant-select-item-option').allInnerTexts()
    return templateNames
  }

  public async selectSendableMessageTemplateByName(templateName: string): Promise<void> {
    if (!templateName || !templateName.length) {
      throw new Error('The provided sendable message template is null or empty')
    }

    // Send an Escape to close all open select dropdowns. This is necessary because the select might already be open.
    await this._window.keyboard.press('Escape')

    const templateSelect = await this.getSendableMessageTemplateSelect()
    await templateSelect.click()

    const selectOption = this._window.locator('.ant-select-item-option').filter({ hasText: templateName }).nth(0)
    await expect(selectOption).toBeVisible()

    await selectOption.click()
  }

  public async getSelectedSendableMessageTemplate(): Promise<CurrentSendableMessage | null> {
    const templateSelect = await this.getSendableMessageTemplateSelect()
    // Due to how AntD Select is build, the text of the selected item is in an element that's a sibling(uncle actually) of the templateSelect
    // So I'm selecting the parent and then looking in the parent for the selected item's text/name
    const templateSelectParent = this._window.locator('div.ant-select-selector', {
      has: this._window.locator('span.ant-select-selection-search', { has: templateSelect })
    })
    await expect(templateSelectParent).toBeVisible()
    const selectedItem = templateSelectParent.locator('.ant-select-selection-item')
    await expect(selectedItem).toBeVisible()
    const name = await selectedItem.textContent()
    if (!name) {
      return null
    }

    const exchangeAndRoutingKey = this._window.locator('#exchangeAndRoutingKey')
    await expect(exchangeAndRoutingKey).toBeVisible()
    const exchangePrefix = 'Exchange:'
    await expect(exchangeAndRoutingKey).toContainText(exchangePrefix)
    const routingKeyMarker = 'Routing key:'
    await expect(exchangeAndRoutingKey).toContainText(routingKeyMarker)

    const combinedExchangeAndRoutingKey = await exchangeAndRoutingKey.textContent()
    const indexOfExchangePrefix = combinedExchangeAndRoutingKey?.indexOf(exchangePrefix)
    const lengthOfExchangePrefix = exchangePrefix.length
    const indexOfRoutingKeyMarker = combinedExchangeAndRoutingKey?.indexOf(routingKeyMarker)
    const lengthOfRoutingKeyMarker = routingKeyMarker.length
    const exchange =
      combinedExchangeAndRoutingKey?.substring(indexOfExchangePrefix! + lengthOfExchangePrefix, indexOfRoutingKeyMarker).trim() ?? ''
    const routingKey = combinedExchangeAndRoutingKey?.substring(indexOfRoutingKeyMarker! + lengthOfRoutingKeyMarker).trim() ?? ''

    // Look for the two monaco editors in the send section container
    const sendSection = this._window.locator('#sendMessageContainer')
    await expect(sendSection).toBeVisible()

    const monacoEditors = sendSection.locator('.monaco-editor')
    const jsonMessageEditor = monacoEditors.nth(0)
    await expect(jsonMessageEditor).toBeVisible()
    const protofileEditor = monacoEditors.nth(1)
    await expect(protofileEditor).toBeVisible()

    const jsonMessage = await this.getMonacoEditorValue(jsonMessageEditor)
    const protofile = await this.getMonacoEditorValue(protofileEditor)

    return {
      name,
      exchange,
      routingKey,
      messageJson: jsonMessage,
      protofile
    }
  }

  private async getMonacoEditorValue(monacoEditorLocator: Locator) {
    await monacoEditorLocator.click()

    // Select and copy the text to clipboard
    if (os.platform() === 'darwin') {
      await this._window.keyboard.press('Meta+A')
      await this._window.keyboard.press('Meta+C')
    } else {
      await this._window.keyboard.press('Control+A')
      await this._window.keyboard.press('Control+C')
    }

    // Read the text from the clipboard
    const clipboardText = await this._window.evaluate(() => navigator.clipboard.readText())
    return clipboardText
  }

  private async getSendableMessageTemplateSelect() {
    const templateSelect = this._window.locator('#sendableMessageTemplatesSelect')
    await expect(templateSelect).toBeVisible()
    return templateSelect
  }

  private async clickCreate(modal: Locator) {
    const createButton = modal.getByRole('button', { name: 'Create' })
    await expect(createButton).toBeVisible()
    await createButton.click()
  }

  private async clickCancel(modal: Locator) {
    const cancelButton = modal.getByRole('button', { name: 'Cancel' })
    await expect(cancelButton).toBeVisible()
    await cancelButton.click()
  }

  private async setProtofile(modal: Locator, protofile: string) {
    await this.setMonacoEditorValue(0, modal, protofile)
  }

  private async setSampleJson(modal: Locator, sampleJson: string | undefined) {
    await this.setMonacoEditorValue(1, modal, sampleJson)
  }

  private async setMonacoEditorValue(nth: number, modal: Locator, value: string | undefined) {
    const monacoEditor = modal.locator('.monaco-editor').nth(nth)
    await expect(monacoEditor).toBeVisible()

    // Focus
    await monacoEditor.click()

    // Clear text
    if (os.platform() === 'darwin') {
      await this._window.keyboard.press('Meta+A')
    } else {
      await this._window.keyboard.press('Control+A')
    }
    await this._window.keyboard.press('Backspace')

    // Type new text
    if (value) {
      await this._window.keyboard.insertText(value)
    }

    return monacoEditor
  }

  private async setTemplateName(modal, templateName: string) {
    await this.setInputValue(modal, 'Name', templateName)
  }
  private async setExchange(modal, exchange: string) {
    await this.setInputValue(modal, 'Exchange', exchange)
  }
  private async setRoutingKey(modal, routingKey: string) {
    await this.setInputValue(modal, 'Routing key', routingKey)
  }

  private async setInputValue(modal: Locator, placeholder: string, value: string) {
    const input = modal.getByPlaceholder(placeholder)
    await expect(input).toBeVisible()
    await input.clear()
    await input.fill(value)
  }

  private async openNewMessageModal() {
    const modal = this._window.locator('.ant-modal-content')
    await expect(modal).toBeVisible()

    const modalTitle = modal.getByText('Add new sendable message template')
    await expect(modalTitle).toBeVisible()

    return modal
  }
}

export interface CurrentSendableMessage {
  name: string
  exchange: string
  routingKey: string
  protofile: string
  messageJson: string
}
