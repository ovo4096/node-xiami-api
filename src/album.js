const crawler = require('./crawler')

class Album {
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
    return crawler.getAlbumContent(id)
  }

  static getTracklist (id) {
    return crawler.getAlbumTracklist(id)
  }

  static search (keyword, page = 1) {
    return crawler.searchAlbums(keyword, page)
  }
}

module.exports = {
  Album
}
