import { Channel, ConsumeMessage } from 'amqplib'
import EventEmitter from 'events'

export default class Consumer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async consumeMessages() {
    console.log('Сервис М2 готов к получению сообщений...')

    this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage) => {
        console.log(
          'Получено сообщение на сервис М1 с М2: ',
          JSON.parse(message.content.toString())
        )
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        )
        this.channel.ack(message)
      },
      {
        noAck: false,
      }
    )
  }
}
