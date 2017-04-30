const xiami = require('../src')

const song = new xiami.Song('mQ5jcl82ede')

song._get().then(() => {
  console.log(song)
}).catch((err) => {
  console.log(err)
})
