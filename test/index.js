const { Album } = require('../src')

Album.getInstance('w6U948110').then((album) => {
  console.log(album.title)
  console.log()
  album.tracklist.then((tracklist) => {
    for (const song of tracklist) {
      song.artists.then((artists) => {
        const artistNames = []
        for (const artist of artists) {
          artistNames.push(artist.name)
          console.log(artist.id)
          if (artist.photoURL !== null) {
            console.log(artist.photoURL.href)
          }
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
