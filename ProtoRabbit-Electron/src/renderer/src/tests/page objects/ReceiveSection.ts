import { expect } from '@playwright/test'
import { Locator, Page } from 'playwright'
import { MonacoEditorPageObject } from './MonacoEditor'

export class ReceiveSection {
  private readonly _window: Page

  constructor(window: Page) {
    this._window = window
  }

  public async openNewSubscriptionModal(): Promise<Locator> {
    const newSubBtn = await this.getOpenNewSubscriptionButton()
    await newSubBtn.click()

    const modal = await this.getModal()

    return modal
  }

  public async createNewSubscription(
    subscriptionName: string,
    exchange: string,
    routingKey: string,
    queueName: string,
    protofile: string
  ): Promise<void> {
    const modal = await this.getModal()
    const subNameLocator = modal.locator('#newSubName')
    await expect(subNameLocator).toBeVisible()
    const exchangeLocator = modal.locator('#newSubExchange')
    await expect(exchangeLocator).toBeVisible()
    const routingKeyLocator = modal.locator('#newSubRoutingKey')
    await expect(routingKeyLocator).toBeVisible()
    const queueLocator = modal.locator('#newSubQueue')
    await expect(queueLocator).toBeVisible()
    const protofileLocator = modal.locator('.monaco-editor')
    await expect(protofileLocator).toBeVisible()
    const createBtnLocator = modal.locator('#newSubCreateBtn')
    await expect(createBtnLocator).toBeVisible()

    await subNameLocator.type(subscriptionName)
    await exchangeLocator.type(exchange)
    await routingKeyLocator.type(routingKey)
    await queueLocator.type(queueName)
    const monacoEditor = new MonacoEditorPageObject(this._window, protofileLocator)
    await monacoEditor.setMonacoEditorValue(protofile)

    await createBtnLocator.click()
  }

  public async getSubscriptions(): Promise<ActiveSubscription[]> {
    const subscriptionList = this._window.locator('#subscriptionList')
    await expect(subscriptionList).toBeVisible()

    await subscriptionList.locator('.ant-list-item').waitFor({ timeout: 10000 })
    const subscriptionListItems = await subscriptionList.locator('.ant-list-item').all()
    if (!subscriptionListItems || !subscriptionListItems.length) {
      return []
    }

    const activeSubscriptions: ActiveSubscription[] = []
    for (const itemLocator of subscriptionListItems) {
      const name = await itemLocator.locator('#subscriptionListItemName').textContent()
      const exchange = await itemLocator.locator('#subscriptionListItemExchange').textContent()
      const routingKey = await itemLocator.locator('#subscriptionListItemRoutingKey').textContent()
      const isSelected = await itemLocator.evaluate((node) => [...node.classList].some((value) => value.includes('_selected')))
      activeSubscriptions.push({ name, exchange, routingKey, isSelected })
    }

    return activeSubscriptions
  }

  private async getModal() {
    const modal = this._window.locator('.ant-modal-content')
    await expect(modal).toBeVisible()
    return modal
  }

  private async getOpenNewSubscriptionButton() {
    const newSubscriptionButton = this._window.locator('#newSubscriptionButton')
    await expect(newSubscriptionButton).toBeVisible()

    return newSubscriptionButton
  }
}

export interface ActiveSubscription {
  name: string | null
  exchange: string | null
  routingKey: string | null
  isSelected: boolean
}
