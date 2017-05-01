const xiami = require('../src')

xiami.utils.getAlbum('w6U948110').then((album) => {
  console.log(album.name + '\n')
  console.log(album.description + '\n')
  console.log(album.coverURL.href + '\n')

  const tasks = []
  for (const id of album.songIds) {
    tasks.push(xiami.utils.getSong(id))
  }

  Promise.all(tasks).then((tracklist) => {
    for (const song of tracklist) {
      console.log(song.name)
      console.log(song.audioURL.href)
      console.log(song.lyricsURL.href)
      console.log()
    }
  }).catch((e) => {
    console.log(e)
  })
}).catch((e) => {
  console.log(e)
})
