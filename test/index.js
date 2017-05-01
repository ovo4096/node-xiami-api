const xiami = require('../src')

xiami.utils.getSong('xLJhMEa6116').then((song) => {
  console.log(`${song.name} (id: ${song.id})`)
}).catch((e) => {
  console.log(e)
})

xiami.utils.getSongInfo('xLJhMEa6116').then((info) => {
  console.log(info)
}).catch((e) => {
  console.log(e)
})
