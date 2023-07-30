import { Channel, ConsumeMessage } from 'amqplib'
import rabbitClient from './client'

export default class Consumer {
  constructor(private channel: Channel, private rpcQueue: string) {}

  async consumeMessages() {
    console.log('Сервис М2 готов к получению сообщений...')

    this.channel.consume(
      this.rpcQueue,
      async (message: ConsumeMessage) => {
        const { correlationId, replyTo } = message.properties
        const operation = message.properties.headers.function
        if (!correlationId || !replyTo) {
          console.log('Не совпадает correlationId или replyTo...')
        }
        const response = JSON.parse(message.content.toString())
        console.log('Получено сообщение с сервиса М1 на М2: ', response)
        await rabbitClient.produce(response, correlationId, replyTo)
      },
      {
        noAck: true,
      }
    )
  }
}
