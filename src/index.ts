import express from 'express'
import cors from 'cors'

import { LoggerFactory } from './adapters/logger/factory'
import { errorController } from './controllers/podcasts/errors/error.controller'

const port = process.env.PORT || 3100

const logger = LoggerFactory.logger()
const app = express()

app.use(cors())

app.get('/', (_req, res) => {
  res.send('Hello World! 🚀')
})

app.use(errorController(logger))

app.listen(port, () => {
  logger.log(`App is run in: ${port}`)
})
