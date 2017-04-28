const FavoriteCollection = require('./favorite-collection')

class XiamiUserClient {
  constructor (username, password) {
    this._login(username, password)
    this._favoriteSongs = new FavoriteCollection()
    this._favoriteAlbums = new FavoriteCollection()
    this._favoriteArtists = new FavoriteCollection()
    this._favoriteFeaturedPlaylists = new FavoriteCollection()
    this._profile = {}
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

  get favoriteFeaturedPlaylists () {
    return this._favoriteFeaturedPlaylists
  }

  get profile () {
    return this._profile
  }

  checkin () {
  }

  _login (username, password) {
  }
}

module.exports = XiamiUserClient
