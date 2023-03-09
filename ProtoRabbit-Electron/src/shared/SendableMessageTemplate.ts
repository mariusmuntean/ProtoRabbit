export interface SendableMessageTemplate {
  /**
   * A name for this sendable message - will be displayed in the UI.
   */
  name: string

  /**
   * The RabbitMQ exchange where the sendable messages will be sent.
   */
  exchange: string

  /**
   * * The RabbitMQ routing key where the sendable messages will be sent.
   */
  routingKey: string

  /**
   * The protobuf file content used to serialize and to deserialize these messages.
   */
  protofile: string

  /**
   * A JSON sample message used to help the user - will be displayed in the UI.
   */
  jsonSample?: string
}
