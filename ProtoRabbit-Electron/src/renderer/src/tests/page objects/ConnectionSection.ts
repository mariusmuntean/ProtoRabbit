import { expect } from '@playwright/test'
import { Page } from 'playwright'

export class ConnectionSection {
  private readonly _window: Page

  constructor(window: Page) {
    this._window = window
  }

  public connect = async (host = 'localhost', port = 5672, username = 'guest', password = 'guest') => {
    await this.setHostInput(host)
    await this.setPortInput(port.toString())
    await this.setUsernameInput(username)
    await this.setPasswordInput(password)

    const connectBtn = this._window.getByRole('button', { name: 'Connect' })
    await expect(connectBtn).toBeVisible()
    await connectBtn.click()
  }

  public disconnect = async () => {
    const disconnectBtn = this._window.getByRole('button', { name: 'Disconnect' })
    await expect(disconnectBtn).toBeVisible()
    await disconnectBtn.click()
  }

  private async setHostInput(host: string) {
    await this.setInputValue('Host', host)
  }
  private async setPortInput(port: string) {
    await this.setInputValue('Port', port)
  }
  private async setUsernameInput(username: string) {
    await this.setInputValue('Username', username)
  }
  private async setPasswordInput(password: string) {
    await this.setInputValue('Password', password)
  }

  private async setInputValue(placeholder: string, value: string) {
    const input = this._window.getByPlaceholder(placeholder)
    await expect(input).toBeVisible()
    await input.clear()
    await input.fill(value)
  }
}
