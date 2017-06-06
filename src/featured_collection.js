const crawler = require('./crawler')

class FeaturedCollection {
  constructor (id) {
    this.id = id
  }

  content () {
    return this.constructor.getContent(this.id)
  }

  tracklist () {
    return this.constructor.getTracklist(this.id)
  }

  static getContent (id) {
    return crawler.getFeaturedCollectionContent(id)
  }

  static getTracklist (id) {
    return crawler.getFeaturedCollectionTracklist(id)
  }

  static search (keyword, page = 1) {
    return crawler.searchFeaturedCollections(keyword, page)
  }
}

module.exports = {
  FeaturedCollection
}
