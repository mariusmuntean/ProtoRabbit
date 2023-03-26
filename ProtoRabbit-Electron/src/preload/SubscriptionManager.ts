import { Channel } from 'amqplib'

import { getProtobufMessageType } from '../shared/ProtofileUtil'
import { fireEvent, subscribe, unsubscribe } from '../shared/PubSub'
import { Subscription } from '../shared/Subscription'

export class SubscriptionManager {
  private readonly _subscriptionsChangedEventName = 'onSubscriptionsChanged'
  private readonly _currentSubscriptionChangedEventName = 'onCurrentSubscriptionChanged'

  private readonly _channel: Channel

  public currentSubscription: Subscription | undefined
  public readonly subscriptions: Array<Subscription> = []

  constructor(channel: Channel) {
    this._channel = channel
  }

  public addNewSubscription = async (
    name: string,
    exchange: string,
    routingKey: string,
    queueName: string,
    protofileData: string
  ): Promise<Subscription> => {
    await this._channel.assertQueue(queueName, { durable: true, autoDelete: true })
    this._channel.bindQueue(queueName, exchange, routingKey)

    const msgType = getProtobufMessageType(protofileData)
    const sub = new Subscription(name, exchange, routingKey, queueName, msgType)
    const consume = await this._channel.consume(queueName, sub.addRabbitMqMessage, { noAck: false })
    sub.consumerTag = consume.consumerTag

    this.subscriptions.push(sub)
    this.fireSubscriptionsChanged()

    return sub
  }

  public setCurrentSubscription = (subscription: Subscription): boolean => {
    if (this.subscriptions.some((s) => s.id === subscription.id)) {
      this.currentSubscription = subscription
      this.fireCurrentSubscriptionChanged()
      return true
    } else {
      console.log('The specified subscription is unknown')
      return false
    }
  }

  public registerForSubscriptionsChanged = (handler: VoidFunction) => {
    subscribe(this._subscriptionsChangedEventName, handler)
  }

  public unregisterForSubscriptionsChanged = (handler: VoidFunction) => {
    unsubscribe(this._subscriptionsChangedEventName, handler)
  }

  public registerForCurrentSubscriptionChanged = (handler: VoidFunction) => {
    subscribe(this._currentSubscriptionChangedEventName, handler)
  }

  public unregisterForCurrentSubscriptionChanged = (handler: VoidFunction) => {
    unsubscribe(this._currentSubscriptionChangedEventName, handler)
  }

  private fireSubscriptionsChanged = () => {
    fireEvent(this._subscriptionsChangedEventName)
  }

  private fireCurrentSubscriptionChanged = () => {
    fireEvent(this._currentSubscriptionChangedEventName)
  }
}
