import { Router } from 'express'
import { LoggerFactory } from '../../adapters/logger/factory'
import { getPodcastListController } from '../../controllers/podcasts/get-podcast-list.controller'

export function podcastsRoute () {
  const api = Router()

  api.get('/', getPodcastListController(LoggerFactory.logger('Podcasts')))

  return api
}
