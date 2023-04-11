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

    await this.expectNewMessageModal()
  }

  public async createNewSendableMessageTemplate(
    templateName: string,
    exchange: string,
    routingKey: string,
    protofile: string,
    messageSampleJson: string | undefined
  ) {
    await this.expectNewMessageModal()

    const modal = await this.expectNewMessageModal()

    await this.setTemplateName(modal, templateName)
    await this.setExchange(modal, exchange)
    await this.setRoutingKey(modal, routingKey)
    await this.setProtofile(modal, protofile)
    await this.setSampleJson(modal, messageSampleJson)

    await this.clickCreate(modal)
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

  private async expectNewMessageModal() {
    const modal = this._window.locator('.ant-modal-content')
    await expect(modal).toBeVisible()

    const modalTitle = modal.getByText('Add new sendable message template')
    await expect(modalTitle).toBeVisible()

    return modal
  }
}
