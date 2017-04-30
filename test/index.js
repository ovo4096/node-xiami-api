const xiami = require('../src')

xiami.getSong('xLomhpe153a').then((song) => {
  console.log(song.name)
  console.log(song.albumId)
  console.log(song.audioURL.href)
}).catch((err) => {
  console.log(err)
})
