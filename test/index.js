const { Album } = require('../src')

Album.getInstance('w6U948110').then((album) => {
  console.log(album.title)
  album.tracklist.then((tracklist) => {
    for (const song of tracklist) {
      song.artists.then((artists) => {
        const artistNames = []
        for (const artist of artists) {
          artistNames.push(artist.name)
        }
        console.log(`${song.title} - ${artistNames}`)
      })
    }
  }).catch((e) => {
    console.log(e)
  })
}).catch((e) => {
  console.log(e)
})
