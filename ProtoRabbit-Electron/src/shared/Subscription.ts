import { ConsumeMessage } from 'amqplib'
import protobuf from 'protobufjs'
import { ulid } from 'ulid'

export class Subscription {
  public readonly id: string = ulid()
  consumerTag: string | undefined

  readonly name: string
  readonly exchange: string
  readonly routingKey: string
  readonly queueName: string

  readonly protobufMessageType: protobuf.Type

  public readonly messages: Message[] = []
  public readonly messageHandlers: HandleNewMessage[] = []

  /**
   *
   * @param name The subscription name.
   * @param exchange The RabbitMQ exchange where the subscription receives messages from.
   * @param routingKey The exchange routing key.
   * @param queueName The name of the queue where the messages are received from.

   */
  constructor(name: string, exchange: string, routingKey: string, queueName: string, protobufMessageType: protobuf.Type) {
    this.name = name
    this.exchange = exchange
    this.routingKey = routingKey
    this.queueName = queueName

    this.protobufMessageType = protobufMessageType
  }

  public addRabbitMqMessage = (newRabbitMqMessage: ConsumeMessage | null) => {
    if (!newRabbitMqMessage) {
      console.log('Received null rabbitMQ message')
      return
    }

    const decodedMessage = this.protobufMessageType.decode(newRabbitMqMessage.content)
    const decodedJsonMessage = JSON.stringify(decodedMessage.toJSON())
    console.log(`Subscription ${this.consumerTag}: ${decodedJsonMessage}`)

    const newMessage = new Message(newRabbitMqMessage, decodedJsonMessage)
    // store them for later
    this.messages.push(newMessage)
    // inform handlers
    this.messageHandlers.forEach((handler) => {
      try {
        handler(newMessage)
      } catch (error) {
        console.error(`Failed to handle message: `, JSON.stringify(newMessage))
      }
    })
  }

  public addNewMessageHandler = (handler: HandleNewMessage) => {
    if (!handler) {
      return
    }
    this.messageHandlers.push(handler)
  }
}

export class Message {
  readonly rabbitMqMsg: ConsumeMessage
  messageJson: string

  constructor(rabbitMqMsg: ConsumeMessage, messageJson: string) {
    this.rabbitMqMsg = rabbitMqMsg
    this.messageJson = messageJson
  }
}

export type HandleNewMessage = (newMessage: Message) => void
