class Song {
  constructor ({
    id = null,
    name = null,
    albumId = null,
    artistIds = null,
    audioURL = null,
    lyricsURL = null
  } = {}) {
    this._id = id
    this._name = name
    this._albumId = albumId
    this._artistIds = artistIds
    this._audioURL = audioURL
    this._lyricsURL = lyricsURL
  }

  get id () {
    return this._id
  }

  get name () {
    return this._name
  }

  get albumId () {
    return this._albumId
  }

  get artistIds () {
    return this._artistIds
  }

  get audioURL () {
    return this._audioURL
  }

  get lyricsURL () {
    return this._lyricsURL
  }
}

module.exports = Song
