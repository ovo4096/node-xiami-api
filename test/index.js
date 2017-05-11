const crawler = require('../src/crawler')

// crawler.getFeaturedCollection(154166515).then((featuredCollection) => {
//   console.log(featuredCollection)
// }).catch((e) => {
//   console.log(e)
// })

// const name = '西沢幸奏'

// crawler.getArtistIdByName(name).then((id) => {
//   console.log('byName: ' + id)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistIdBySearch(name).then((id) => {
//   console.log('bySearch: ' + id)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistIdByNameOrSearch(name).then((id) => {
//   console.log('byNameOrSearch: ' + id)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistProfile(88987).then((profile) => {
//   console.log(profile)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.searchArtists('周杰伦').then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

crawler.getArtistTop100Songs(83497).then((result) => {
  console.log(result)
}).catch((e) => {
  console.log(e)
})
