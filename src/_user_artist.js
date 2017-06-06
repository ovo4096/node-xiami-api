const crawler = require('./crawler')
const { Artist } = require('./artist')

class UserArtist extends Artist {
  constructor (id, userToken) {
    super()
    this.id = id
    this.userToken = userToken
  }

  tracklist () {
    return crawler.getArtistTracklist(this.id, this.userToken)
  }
}

module.exports = {
  UserArtist
}
