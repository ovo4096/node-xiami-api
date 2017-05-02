const { Song, util } = require('../src')

util.getSong(1773215606).then((song) => {
  console.log(song)
})

Song.getInstance(1773215606).then((song) => {
  song.album.then((album) => {
    console.log(album)
    album.tracklist.then((tracklist) => {
      console.log(tracklist)
    })
  })
}).catch((e) => {
  console.log(e)
})
