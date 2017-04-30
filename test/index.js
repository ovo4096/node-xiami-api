const xiami = require('../src')

xiami.getSong(1774179097).then((song) => {
  console.log(song.name)
  console.log(song.audioURL)
}).catch((err) => {
  console.log(err)
})
