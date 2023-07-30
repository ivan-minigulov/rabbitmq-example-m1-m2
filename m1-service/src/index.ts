import express from 'express'
import RabbitMQClient from './rabbitmq/client'

const app = express()
app.use(express.json())

const PORT = 3001

app.post('/send', async (req, res, next) => {
  console.log('Сообщение к отправке с сервиса М1 на М2: ', req.body)
  const response = await RabbitMQClient.produce(req.body)
  res.send({ response })
})

app.listen(PORT, async () => {
  console.log(`Server running on PORT ${PORT}`)
  RabbitMQClient.initialize()
})
