const { User } = require('../src')

User.login('', '').then((user) => {
  user.dailyRecommendedTracklist().then((tracklist) => {
    console.log(tracklist)
  }).catch((e) => {
    console.log(e)
  })
}).catch((e) => {
  console.log(e)
})
