const FavoriteCollection = require('./_favorite-collection')

class UserClient {
  constructor (username, password) {
    this._login(username, password)
    this._favoriteSongs = new FavoriteCollection()
    this._favoriteAlbums = new FavoriteCollection()
    this._favoriteArtists = new FavoriteCollection()
    this._favoriteFeaturedPlaylists = new FavoriteCollection()
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

  get favoriteFeaturedPlaylists () {
    return this._favoriteFeaturedPlaylists
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
