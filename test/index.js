const { Artist } = require('../src')

Artist.get('caEP216c9').then((artist) => {
  artist.albums.get(0).then((album) => {
    console.log(album)
  }).catch((e) => {
    console.log(e)
  })
}).catch((e) => {
  console.log(e)
})
