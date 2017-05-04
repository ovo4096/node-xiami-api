class Album {
  constructor ({
    id = null,
    title = null,
    subtitle = null,
    artistId = null,
    tracklist = null,
    coverURL = null,
    description = null
  } = {}) {
    this._id = id
    this._title = title
    this._subtitle = subtitle
    this._artistId = artistId
    this._tracklist = tracklist
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
    return util.getArtist(this._artistId)
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
