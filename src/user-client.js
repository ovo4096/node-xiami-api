const Collection = require('./_collection')

class UserClient {
  constructor (username, password) {
    this._login(username, password)
    this._favoriteSongs = new Collection()
    this._favoriteAlbums = new Collection()
    this._favoriteArtists = new Collection()
    this._favoriteFeatures = new Collection()
    this._profile = {}
    this._todayRecommendedPlaylist = {}
  }

  get favoriteSongs () {
    return this._favoriteSongs
  }

  get favoriteAlbums () {
    return this._favoriteAlbums
  }

  get favoriteArtists () {
    return this._favoriteArtists
  }

  get favoriteFeatures () {
    return this._favoriteFeatures
  }

  get profile () {
    return this._profile
  }

  get todayRecommendedPlaylist () {
    return this._todayRecommendedPlaylist
  }

  checkin () {
  }

  _login (username, password) {
  }
}

module.exports = UserClient
