const { Artist } = require('../src')

Artist.get('iim17edb').then((artist) => {
  artist.albums.slice(-2).then((albums) => {
    for (const album of albums) {
      console.log(album.title)
    }
  }).catch((e) => {
    console.log(e)
  })
}).catch((e) => {
  console.log(e)
})
