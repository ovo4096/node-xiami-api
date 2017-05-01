const xiami = require('../src')

// xiami.utils.getAlbum('nmTZ4o4e16d').then((album) => {
//   console.log(album)

//   const getSongTaskQueue = []
//   for (const id of album.songIds) {
//     getSongTaskQueue.push(xiami.utils.getSong(id))
//   }

//   Promise.all(getSongTaskQueue).then((tracklist) => {
//     for (const song of tracklist) {
//       console.log(song)
//     }
//   }).catch((e) => {
//     console.log(e)
//   })
// }).catch((e) => {
//   console.log(e)
// })

xiami.utils.getArtistDescription(54976).then((description) => {
  console.log(description)
}).catch((e) => {
  console.log(e)
})
