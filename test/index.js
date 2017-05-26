const crawler = require('../src/crawler')

// crawler.getFeaturedCollection(154166515).then((collection) => {
//   for (const song of collection.tracklist) {
//     console.log(song)
//   }
// }).catch((e) => {
//   console.log(e)
// })

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

// crawler.getUserFavoriteSongs(4782340, 2).then((favoriteSongs) => {
//   console.log(favoriteSongs)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserFavoriteAlbums(4782340, 3).then((albums) => {
//   console.log(albums.data)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserFavoriteFeaturedCollection(4782340).then((fc) => {
//   console.log(fc.data)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserCreatedFeaturedCollection(4782340).then((fc) => {
//   console.log(fc.data)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserFavoriteArtists(4782340, 213).then((fa) => {
//   console.log(fa)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserProfile(4782340).then((user) => {
//   console.log(user)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getUserToken('', '').then((token) => {
//   console.log(token)
//   crawler.getUserDailyRecommendedTracklist(token).then((tracklist) => {
//     console.log(tracklist)
//   }).catch((e) => {
//     console.log(e)
//   })
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getRadioTracklist(crawler.RADIO_TRACKLIST_TYPE_ARTIST, 56351).then((tracklist) => {
//   for (const song of tracklist) {
//     console.log(song.album)
//   }
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getAlbumTracklist(418377).then((tracklist) => {
//   for (const song of tracklist) {
//     console.log(song.album)
//   }
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getSong(1769916564).then((song) => {
//   console.log(song)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getAlbumProfile(1).then((album) => {
//   console.log(album)
// })

// crawler.getArtistRadioTracklist(86298).then((tracklist) => {
//   console.log(tracklist)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.searchFeaturedCollections('测试').then((pageResults) => {
//   console.log(pageResults)
//   for (const featuredCollection of pageResults.data) {
//     console.log(featuredCollection)
//   }
// }).catch((e) => {
//   console.log(e)
// })

// crawler.addFavorite(2088147, '').then((json) => {
//   console.log(json)
// }).catch((e) => {
//   console.log(e)
// })

// crawler.getSongHQAudioURL(1795555753).then((url) => {
//   console.log(url)
// }).catch((e) => {
//   console.log(e)
// })

crawler.addFavorite(39319022, crawler.FAVORITE_TYPE_FEATURED_COLLECTION, '').then((status) => {
  console.log(status)
}).catch((e) => {
  console.log(e)
})

crawler.deleteFavorite(39319022, crawler.FAVORITE_TYPE_FEATURED_COLLECTION, '').then((status) => {
  console.log(status)
}).catch((e) => {
  console.log(e)
})
