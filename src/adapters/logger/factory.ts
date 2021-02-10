import { createLogger } from './logger'

export class LoggerFactory {
  static logger (context = 'App') {
    return createLogger(context)
  }
}
