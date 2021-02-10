import { Logger } from '../../../adapters/logger/logger'

import { Request, Response, NextFunction } from 'express'
import { LoggerFactory } from '../../../adapters/logger/factory'

export function errorHandler (logger: Logger = LoggerFactory.logger()) {
  return function (res: Response, err: Error) {
    logger.error(err)
    res.status(500).send(err.message)
  }
}

export function errorController (logger: Logger) {
  const handler = errorHandler(logger)
  return function (error: Error, _req: Request, res: Response, _next: NextFunction) {
    handler(res, error)
  }
}
