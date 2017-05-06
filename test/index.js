const { Artist } = require('../src')

Artist.get('iim17edb').then((artist) => {
  artist.top100Songs.slice(-10, -1).then((songs) => {
    console.log(songs)
    console.log(songs.length)
  })
}).catch((e) => {
  console.log(e)
})
