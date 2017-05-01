const xiami = require('../src')

xiami.utils.getSong('xLJhMEa6116').then((song) => {
  console.log(`${song.name} (id: ${song.id})`)
}).catch((err) => {
  console.log(err)
})
