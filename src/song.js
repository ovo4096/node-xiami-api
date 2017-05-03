class Song {
  constructor ({
    id = null,
    title = null,
    subtitle = null,
    albumId = null,
    artistIds = null,
    audioURL = null,
    lyricsURL = null
  } = {}) {
    this._id = id
    this._title = title
    this._subtitle = subtitle
    this._albumId = albumId
    this._artists = new LazyLoadCollection(Artist.get, artistIds)
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
    return Album.get(this._albumId)
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
const Album = require('./album')
const Artist = require('./artist')
const LazyLoadCollection = require('./_lazy-load-collection')
