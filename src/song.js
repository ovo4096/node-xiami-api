class Song {
  constructor ({
    id = null,
    title = null,
    subtitle = null,
    albumId = null,
    artists = null,
    audioURL = null,
    lyricsURL = null
  } = {}) {
    this._id = id
    this._title = title
    this._subtitle = subtitle
    this._albumId = albumId
    this._artists = artists
    this._audioURL = audioURL
    this._lyricsURL = lyricsURL
  }

  get id () {
    return this._id
  }

  get title () {
    return this._title
  }

  get subtitle () {
    return this._subtitle
  }

  get album () {
    return util.getAlbum(this._albumId)
  }

  get artists () {
    return this._artists
  }

  get audioURL () {
    return this._audioURL
  }

  get lyricsURL () {
    return this._lyricsURL
  }

  static get (id) {
    return util.getSong(id)
  }
}

module.exports = Song

const util = require('./util')
