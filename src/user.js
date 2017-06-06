const crawler = require('./crawler')
const { UserAlbum } = require('./_user_album')
const { UserArtist } = require('./_user_artist')
const { UserFeaturedCollection } = require('./_user_featured_collection')
const { UserSong } = require('./_user_song')

class User {
  constructor ({ id, name, userToken }) {
    this.id = id
    this.name = name
    this.userToken = userToken
  }

  getAlbum (id) {
    return new UserAlbum(id, this.userToken)
  }

  getArtist (id) {
    return new UserArtist(id, this.userToken)
  }

  getFeaturedCollection (id) {
    return new UserFeaturedCollection(id, this.userToken)
  }

  getSong (id) {
    return new UserSong(id, this.userToken)
  }

  favoredSongs (page = 1) {
    return this.constructor.getFavoredSongs(this.id, page)
  }

  favoredAlbums (page = 1) {
    return this.constructor.getFavoredAlbums(this.id, page)
  }

  favoredFeaturedCollections (page = 1) {
    return this.constructor.getFavoredFeaturedCollections(this.id, page)
  }

  createdFeaturedCollections (page = 1) {
    return this.constructor.getCreatedFeaturedCollections(this.id, page)
  }

  favoredArtists (page = 1) {
    return this.constructor.getFavoredArtists(this.id, page)
  }

  profile () {
    return this.constructor.getProfile(this.id)
  }

  radioTracklist () {
    return this.constructor.getRadioTracklist(this.id)
  }

  dailyRecommendedTracklist () {
    return crawler.getDailyRecommendedTracklist(this.userToken)
  }

  addAlbumToFavorite (albumId) {
    return crawler.addAlbumToUserFavorite(albumId, this.userToken)
  }

  deleteAlbumFromFavorite (albumId) {
    return crawler.deleteAlbumFromUserFavorite(albumId, this.userToken)
  }

  addSongToFavorite (songId) {
    return crawler.addSongToUserFavorite(songId, this.userToken)
  }

  deleteSongFromFavorite (songId) {
    return crawler.deleteSongFromUserFavorite(songId, this.userToken)
  }

  addArtistToFavorite (artistId) {
    return crawler.addArtistToUserFavorite(artistId, this.userToken)
  }

  deleteArtistFromFavorite (artistId) {
    return crawler.deleteArtistFromUserFavorite(artistId, this.userToken)
  }

  addFeaturedCollectionToFavorite (featuredCollectionId) {
    return crawler.addFeaturedCollectionToUserFavorite(featuredCollectionId, this.userToken)
  }

  deleteFeaturedCollectionFromFavorite (featuredCollectionId) {
    return crawler.deleteFeaturedCollectionFromUserFavorite(featuredCollectionId, this.userToken)
  }

  static getFavoredSongs (id, page = 1) {
    return crawler.getUserFavoredSongs(id, page)
  }

  static getFavoredAlbums (id, page = 1) {
    return crawler.getUserFavoredAlbums(id, page)
  }

  static getFavoredFeaturedCollections (id, page = 1) {
    return crawler.getUserFavoredFeaturedCollections(id, page)
  }

  static getCreatedFeaturedCollections (id, page = 1) {
    return crawler.getUserCreatedFeaturedCollections(id, page)
  }

  static getFavoredArtists (id, page = 1) {
    return crawler.getUserFavoredArtists(id, page)
  }

  static getProfile (id) {
    return crawler.getUserProfile(id)
  }

  static login (username, password) {
    return new Promise((resolve, reject) => {
      crawler.login(username, password).then((profile) => {
        resolve(new this(profile))
      }).catch((e) => {
        reject(e)
      })
    })
  }

  static getRadioTracklist (id) {
    return crawler.getUserRadioTracklist(id)
  }
}

module.exports = {
  User
}
