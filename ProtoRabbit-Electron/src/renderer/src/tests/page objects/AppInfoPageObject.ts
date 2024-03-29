import { expect } from '@playwright/test'
import { Page } from 'playwright'
import fs from 'fs'

export class AppInfoPageObject {
  private readonly _window: Page

  constructor(window: Page) {
    this._window = window
  }

  public async getInfo(): Promise<Info> {
    const appInfoBtn = this._window.locator('#appInfoBtn')
    await expect(appInfoBtn).toBeVisible()

    await appInfoBtn.click()

    const appInfoPath = this._window.locator('#appInfoConfigPath')
    await expect(appInfoPath).toBeVisible()

    const info = {
      configPath: await appInfoPath.innerText()
    }

    await this._window.locator('.ant-modal-close-x').click()

    return info
  }

  public async deleteAppConfigFile(): Promise<void> {
    const appInfo = await this.getInfo()
    fs.unlink(appInfo.configPath, (e) => {
      if (e) {
        throw e
      }
    })
  }
}
export interface Info {
  configPath: string
}
