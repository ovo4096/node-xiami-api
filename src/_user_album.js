const crawler = require('./crawler')
const { Album } = require('./album')

class UserAlbum extends Album {
  constructor (id, userToken) {
    super()
    this.id = id
    this.userToken = userToken
  }

  content () {
    return crawler.getAlbumContent(this.id, this.userToken)
  }

  tracklist () {
    return crawler.getAlbumTracklist(this.id, this.userToken)
  }
}

module.exports = {
  UserAlbum
}
