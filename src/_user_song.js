const crawler = require('./crawler')
const { Song } = require('./song')

class UserSong extends Song {
  constructor (id, userToken) {
    super()
    this.id = id
    this.userToken = userToken
  }

  content () {
    return crawler.getSongContent(this.id, this.userToken)
  }

  tracklist () {
    return crawler.getSongsTracklist([ this.id ], this.userToken)
  }
}

module.exports = {
  UserSong
}
