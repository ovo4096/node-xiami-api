const { Artist } = require('../src')

Artist.get('iim17edb').then((artist) => {
  artist.albums.slice(-1).then((albums) => {
    console.log(albums)
    console.log(albums.length)
  })
}).catch((e) => {
  console.log(e)
})
