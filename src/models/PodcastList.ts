import { Podcast } from './Podcast'

export interface PodcastList {
  title: string,
  url: string,
  total: number,
  items: number,
  podcasts: Podcast[]
}
