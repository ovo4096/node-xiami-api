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
    this._tracklistIds = tracklistIds
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
    return Artist.getInstance(this._artistId)
  }

  get tracklist () {
    const tracklist = []
    for (const id of this._tracklistIds) {
      tracklist.push(Song.getInstance(id))
    }
    return Promise.all(tracklist)
  }

  get coverURL () {
    return this._coverURL
  }

  get description () {
    return this._description
  }

  static getInstance (id) {
    return util.getAlbum(id)
  }
}

module.exports = Album

const util = require('./util')
const Song = require('./song')
const Artist = require('./artist')
