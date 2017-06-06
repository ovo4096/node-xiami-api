const crawler = require('./crawler')

class Artist {
  constructor (id) {
    this.id = id
  }

  profile () {
    return this.constructor.getProfile(this.id)
  }

  albums (page = 1) {
    return this.constructor.getAlbums(this.id, page)
  }

  top100Songs (page = 1) {
    return this.constructor.getTop100Songs(this.id, page)
  }

  tracklist () {
    return this.constructor.getTracklist(this.id)
  }

  radioTracklist () {
    return this.constructor.getRadioTracklist(this.id)
  }

  static getIdByName (name) {
    return crawler.getArtistIdByName(name)
  }

  static getIdBySearch (keyword) {
    return crawler.getArtistIdBySearch(keyword)
  }

  static getIdByNameOrSearch (nameOrKeyword) {
    return crawler.getArtistIdByNameOrSearch(nameOrKeyword)
  }

  static getProfile (id) {
    return crawler.getArtistProfile(id)
  }

  static getAlbums (id, page = 1) {
    return crawler.getArtistAlbums(id, page)
  }

  static getTop100Songs (id, page = 1) {
    return crawler.getTop100Songs(id, page)
  }

  static convertStringIdToNumberId (stringId) {
    return crawler.convertArtistStringIdToNumberId(stringId)
  }

  static getTracklist (id) {
    return crawler.getArtistTracklist(id)
  }

  static getRadioTracklist (id) {
    return crawler.getArtistRadioTracklist(id)
  }

  static search (keyword, page = 1) {
    return crawler.searchArtists(keyword, page)
  }
}

module.exports = {
  Artist
}
