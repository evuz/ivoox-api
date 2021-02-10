import { Request, Response } from 'express'
import got from 'got'
import $ from 'cheerio'
import { URL } from 'url'

import { Logger } from '../../adapters/logger/logger'
import { Podcast } from '../../models/Podcast'
import { errorHandler } from './errors/error.controller'
import { PodcastList } from '../../models/PodcastList'

type Cheerio = ReturnType<typeof $.load>

function createIvooxUrl (path: string) {
  return `https://www.ivoox.com/${path}.html`
}

async function loadWebsite (url: string) {
  const res = await got.get(url)
  return $.load(res.body)
}

function getTotal (website: Cheerio) {
  const totalElements = website('.mini-navbar .icon-micro')
  return +totalElements.first().text().trim()
}

function getTitle (website: Cheerio) {
  const title = website('.ficha-podcast span#list_title_new')
  return title.first().text().trim()
}

function createAudioUrl (podcastUrl: string) {
  const url = new URL(podcastUrl)
  const path = url.pathname

  const regex = /audios-mp3_rf_(\d*)_/
  const result = regex.exec(path)

  if (!result) {
    return undefined
  }

  const id = result[1]
  const name = path.replace(/-audios.*/, '')

  url.pathname = `${name}_mf_${id}_feed_1.mp3`
  return url.toString()
}

function getPodcasts (website: Cheerio): Podcast[] {
  const elements = website('.flipper .modulo-type-episodio')

  const podcasts: Podcast[] = []

  elements.each((i, child) => {
    const el = $(child)
    const titleEl = el.find('.title-wrapper > a')
    const title = titleEl.text().trim()
    const podcastUrl = titleEl.attr('href').trim()
    const description = el.find('.title-wrapper > button').attr('data-content').trim()
    const likes = el.find('.action > .likes > a').text().trim()
    const audio = createAudioUrl(podcastUrl)

    podcasts.push(<any>{
      title,
      description,
      url: podcastUrl,
      likes,
      audio
    })
  })

  return podcasts
}

export function getPodcastListController (logger: Logger) {
  const sendError = errorHandler(logger)
  return async function (req: Request, res: Response) {
    const { id, page = 1 } = req.query

    if (!id) {
      return sendError(res, Error('The query param "id" is mandatory'))
    }

    if (typeof id !== 'string') {
      return sendError(res, Error('The query param "id" must be a string'))
    }

    const path = `${id.replace(/_\d$/, '')}_${page}`
    const url = createIvooxUrl(path)

    logger.log(`Get podcasts from ${path}`)

    const ivooxWebsite = await loadWebsite(url)
    const podcasts = getPodcasts(ivooxWebsite)

    if (!podcasts.length) {
      return sendError(res, Error('This author has no podcast available'))
    }

    const total = getTotal(ivooxWebsite)
    const title = getTitle(ivooxWebsite)

    const response: PodcastList = {
      title,
      url,
      items: podcasts.length,
      total,
      podcasts
    }

    res.status(200).json(response)
  }
}
