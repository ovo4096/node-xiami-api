const xiami = require('../src')

xiami.getSong(1, (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(data)
})
