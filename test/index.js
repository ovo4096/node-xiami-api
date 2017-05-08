const crawler = require('../src/crawler')

crawler.getFeaturedCollection(154166515).then((data) => {
  for (const song of data.tracklist) {
    console.log(song.title)
    console.log(song.artists)
  }
}).catch((e) => {
  console.log(e)
})
