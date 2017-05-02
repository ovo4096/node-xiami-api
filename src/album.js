class Album {
  constructor ({
    id = null,
    name = null,
    artistId = null,
    tracklistIds = null,
    coverURL = null,
    description = null
  } = {}) {
    this._id = id
    this._name = name
    this._artistId = artistId
    this._tracklistIds = tracklistIds
    this._coverURL = coverURL
    this._description = description
  }

  get id () {
    return this._id
  }

  get name () {
    return this._name
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
