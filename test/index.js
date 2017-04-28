const XiamiClient = require('../src/xiami-client')
const XiamiUserClient = require('../src/xiami-user-client')

const userClient = new XiamiUserClient('demo', 'demo@demo.cc')

console.log(userClient.profile)
console.log(userClient.favoriteAlbums.slice(5, 11))
console.log(userClient.favoriteAlbums.forPage(userClient.favoriteAlbums.total / 25, 25))
userClient.checkin()

console.log(XiamiClient.getAlbum(198))
console.log(XiamiClient.getFavoriteAlbums(998))
console.log(XiamiClient.getProfile(998))
