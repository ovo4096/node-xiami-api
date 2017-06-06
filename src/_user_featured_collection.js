const crawler = require('./crawler')
const { FeaturedCollection } = require('./featured_collection')

class UserFeaturedCollection extends FeaturedCollection {
  constructor (id, userToken) {
    super()
    this.id = id
    this.userToken = userToken
  }

  content () {
    return crawler.getFeaturedCollectionContent(this.id, this.userToken)
  }

  tracklist () {
    return crawler.getFeaturedCollectionTracklist(this.id, this.userToken)
  }
}

module.exports = {
  UserFeaturedCollection
}
