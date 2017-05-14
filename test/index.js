const crawler = require('../src/crawler')

crawler.getFeaturedCollection(154166515).then((collection) => {
  for (const song of collection.tracklist) {
    console.log(song)
  }
}).catch((e) => {
  console.log(e)
})

// const name = '西沢幸奏'

// crawler.getArtistIdByName(name).then((id) => {
//   console.log('byName: ' + id)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistIdBySearch(name).then((id) => {
//   console.log('bySearch: ' + id)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistIdByNameOrSearch(name).then((id) => {
//   console.log('byNameOrSearch: ' + id)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistProfile(88987).then((profile) => {
//   console.log(profile)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.searchArtists('周杰伦').then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistTop100Songs(83497).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getFeaturedCollection(774491).then((collection) => {
//   console.log(collection.introduction)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getArtistIdByName('周杰伦').then((id) => {
//   if (id === null) return
//   crawler.getArtistProfile(id).then((profile) => {
//     console.log(profile.introduction)
//   }).catch((e) => {
//     console.log(e)
//   })
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getAlbum('kj2lb3d2c').then((album) => {
//   console.log(album)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getSong('mQ4D2c93887').then((song) => {
//   console.log('low')
//   console.log(song)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getTracklist(crawler.TRACKLIST_TYPE_ARTIST, 80290).then((tracklist) => {
//   console.log(tracklist)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getSongHQAudioURL(1773270033).then((hQAudioURL) => {
//   console.log(hQAudioURL)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserFavoriteSongs(12119063, 2).then((favoriteSongs) => {
//   console.log(favoriteSongs)
// }).catch((e) => {
//   console.log(e)
// })
