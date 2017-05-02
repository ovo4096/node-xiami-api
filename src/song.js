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
    this._artistIds = artistIds
    this._audioURL = audioURL
    this._lyricsURL = lyricsURL
  }

  get id () {
    return this._id
  }

  get title () {
    return this._name
  }

  get subtitle () {
    return this._subtitle
  }

  get album () {
    return Album.getInstance(this._albumId)
  }

  get artists () {
    const artists = []
    for (const id of this._artistIds) {
      artists.push(Artist.getInstance(id))
    }
    return Promise.all(artists)
  }

  get audioURL () {
    return this._audioURL
  }

  get lyricsURL () {
    return this._lyricsURL
  }

  static getInstance (id) {
    return util.getSong(id)
  }
}

module.exports = Song

const util = require('./util')
const Album = require('./album')
const Artist = require('./artist')
