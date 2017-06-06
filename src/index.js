const crawler = require('./crawler')
const { FeaturedCollection } = require('./featured_collection')
const { Artist } = require('./artist')
const { Album } = require('./album')
const { Song } = require('./song')
const { User } = require('./user')

module.exports = {
  crawler,
  FeaturedCollection,
  Artist,
  Album,
  Song,
  User
}
