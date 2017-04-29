const xiami = require('../src')

xiami.Song.get(1776297615, (err, song) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(song.name)
})
