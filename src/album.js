class Album {
  constructor ({
    id = null,
    title = null,
    subtitle = null,
    artistId = null,
    tracklistIds = null,
    coverURL = null,
    description = null
  } = {}) {
    this._id = id
    this._title = title
    this._subtitle = subtitle
    this._artistId = artistId
    this._tracklist = new LazyLoadCollection(Song.get, tracklistIds)
    this._coverURL = coverURL
    this._description = description
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

  get artist () {
    return Artist.get(this._artistId)
  }

  get tracklist () {
    return this._tracklist
  }

  get coverURL () {
    return this._coverURL
  }

  get description () {
    return this._description
  }

  static get (id) {
    return util.getAlbum(id)
  }
}

module.exports = Album

const util = require('./util')
const Song = require('./song')
const Artist = require('./artist')
const LazyLoadCollection = require('./_lazy-load-collection')
