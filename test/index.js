const crawler = require('../src/crawler')

crawler.getFeaturedCollection(154166515).then((featuredCollection) => {
  console.log(featuredCollection)
}).catch((e) => {
  console.log(e)
})
