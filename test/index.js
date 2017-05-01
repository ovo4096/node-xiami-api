const xiami = require('../src')

xiami.utils.getAlbum('w6U948110').then((album) => {
  console.log(album)

  const getSongTaskQueue = []
  for (const id of album.songIds) {
    getSongTaskQueue.push(xiami.utils.getSong(id))
  }

  Promise.all(getSongTaskQueue).then((tracklist) => {
    for (const song of tracklist) {
      console.log(song)
    }
  }).catch((e) => {
    console.log(e)
  })
}).catch((e) => {
  console.log(e)
})
