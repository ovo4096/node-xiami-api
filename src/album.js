class Album {
  constructor ({
    id = null,
    name = null,
    artistId = null,
    songIds = null,
    coverURL = null,
    description = null
  } = {}) {
    this._id = id
    this._name = name
    this._artistId = artistId
    this._songIds = songIds
    this._coverURL = coverURL
    this._description = description
  }

  get id () {
    return this._id
  }

  get name () {
    return this._name
  }

  get artistId () {
    return this._artistId
  }

  get songIds () {
    return this._songIds
  }

  get coverURL () {
    return this._coverURL
  }

  get description () {
    return this._description
  }
}

module.exports = Album
