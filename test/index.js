const crawler = require('../src/crawler')

// crawler.getFeaturedCollection(154166515).then((featuredCollection) => {
//   console.log(featuredCollection)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.searchArtists('sx').then((searchResult) => {
//   console.log(searchResult)
// }).catch((e) => {
//   console.log(e)
// })

const searchName = 'sx'
crawler.getArtistIdByName(searchName).then((id) => {
  if (id === null) {
    crawler.searchArtists(searchName).then((result) => {
      if (result === null) return
      console.log(result.data[0].id)
    }).catch((e) => {
      console.log(e)
    })
    return
  }
  console.log(id)
}).catch((e) => {

})
