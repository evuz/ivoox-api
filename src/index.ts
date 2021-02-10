import express from 'express'

import { LoggerFactory } from './adapters/logger/factory'

const port = process.env.PORT || 3100

const app = express()
const logger = LoggerFactory.logger()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  logger.log(`App is run in: ${port}`)
})
