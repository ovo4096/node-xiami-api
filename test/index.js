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

crawler.getArtistIdByName('MYTH & ROID').then((id) => {
  if (id === null) {
    crawler.searchArtists('MYTH & ROID').then((searchResult) => {
      if (searchResult.data.length > 0) {
        console.log(searchResult.data[0].id)
      }
    }).catch((e) => {
      console.log(e)
    })
  } else {
    console.log(id)
  }
}).catch((e) => {

})
