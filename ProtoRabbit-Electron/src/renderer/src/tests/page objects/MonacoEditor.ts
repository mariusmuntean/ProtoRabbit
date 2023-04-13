import { expect } from '@playwright/test'
import { Locator, Page } from 'playwright'
import os from 'os'

export class MonacoEditorPageObject {
  private readonly _editorLocator: Locator
  private readonly _window: Page

  constructor(window: Page, editor: Locator) {
    this._editorLocator = editor
    this._window = window
  }

  public async setMonacoEditorValue(value: string | undefined) {
    await expect(this._editorLocator).toBeVisible()

    // Focus
    await this._editorLocator.click()

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
  }
}
