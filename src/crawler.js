const http = require('http')
const https = require('https')
const url = require('url')
const cheerio = require('cheerio')
const FormData = require('form-data')

const MAX_SEARCH_ARTISTS_PAGE_ITEMS = 30
const MAX_ARTIST_ALBUMS_PAGE_ITEMS = 12
const MAX_ARTIST_TOP100_PAGE_ITEMS = 20
const MAX_USER_FAVORED_SONGS_PAGE_ITEMS = 25
const MAX_USER_FAVORED_ALBUMS_PAGE_ITEMS = 15
const MAX_USER_FAVORED_ARTISTS_PAGE_ITEMS = 15

const TRACKLIST_TYPE_SONG = 0
const TRACKLIST_TYPE_ALBUM = 1
const TRACKLIST_TYPE_ARTIST = 2
const TRACKLIST_TYPE_FEATURED_COLLECTION = 3

function _editorTextFormatToString (text) {
  return text.replace(/\t/g, '').replace(/\r/g, '')
}

function _decodeLocation (location) {
  let loc2 = parseInt(location.substr(0, 1))
  let loc3 = location.substr(1)
  let loc4 = Math.floor(loc3.length / loc2)
  let loc5 = loc3.length % loc2
  let loc6 = []
  let loc7 = 0
  let loc8 = ''
  let loc9 = ''
  let loc10 = ''
  while (loc7 < loc5) {
    loc6[loc7] = loc3.substr((loc4 + 1) * loc7, loc4 + 1)
    loc7++
  }
  loc7 = loc5
  while (loc7 < loc2) {
    loc6[loc7] = loc3.substr(loc4 * (loc7 - loc5) + (loc4 + 1) * loc5, loc4)
    loc7++
  }
  loc7 = 0
  while (loc7 < loc6[0].length) {
    loc10 = 0
    while (loc10 < loc6.length) {
      loc8 += loc6[loc10][loc7] !== undefined ? loc6[loc10][loc7] : ''
      loc10++
    }
    loc7++
  }

  loc9 = decodeURIComponent(loc8).replace(/\^/g, '0')
  return loc9
}

function getFeaturedCollectionProfile (id) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/collect/${id}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)

        const title = $('h2').clone().children().remove().end().text().trim()
        const tracklist = []

        let avatarURL = $('.collect_cover > img').attr('src').replace(/@.*$/, '')
        avatarURL = avatarURL.match(/\/\/pic\.xiami.net\/images\/default\/avatar/) !== null ? null : url.parse(avatarURL)

        const auther = {
          id: parseInt($('h4 > a').attr('name_card')),
          name: $('h4 > a').text().trim(),
          avatarURL
        }
        const introduction = _editorTextFormatToString($('.info_intro_full').text().trim())
        const id = parseInt($('#qrcode > span').text())

        let coverURL = $('.bigImgCover > img').attr('src').replace(/@.*$/, '')
        coverURL = coverURL === 'http://pic.xiami.net/res/img/default/collect_default_cover.png' ? null : url.parse(coverURL)

        $('.quote_song_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $input = $element.find('input[type="checkbox"]')

          const id = parseInt($input.attr('value'))
          const canBePlayed = $input.is(':checked')
          const title = canBePlayed
                          ? $element.find('.song_toclt').attr('title').trim().match(/^添加(.*)到歌单$/)[1]
                          : $element.find('.song_name').text().trim().match(/^.*(?=\s*--)/)[0].trim()
          const artists = []
          let introduction = _editorTextFormatToString($element.find('#des_').text().trim())
          introduction = introduction === '' ? null : introduction

          $element.find('.song_name > a[href^="/artist/"], .song_name > a[href^="http://www.xiami.com/search/find"]').each((_, element) => {
            const $element = $(element)
            const href = $element.attr('href')

            const name = $element.text().trim()
            const id = href.match(/^http:\/\/www\.xiami\.com\/search\/find.*/) !== null ? null : href.match(/\w+$/)[0]
            artists.push({ name, id })
          })

          tracklist.push({ id, title, artists, introduction, canBePlayed })
        })
        resolve({
          id,
          title,
          auther,
          introduction,
          tracklist,
          coverURL
        })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getArtistIdByName (name) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/search/find?artist=${encodeURIComponent(name)}`, (res) => {
      const { statusCode, headers } = res

      let error
      if (statusCode !== 301 && statusCode !== 302) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      if (statusCode === 302) {
        resolve(null)
        res.resume()
      } else {
        resolve(headers.location.match(/\w+$/)[0])
        res.resume()
      }
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function searchArtists (keyword, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/search/artist/page/${page}?key=${encodeURIComponent(keyword)}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)

        const total = parseInt($('.seek_counts.ok > b:first-child').text().trim())
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_SEARCH_ARTISTS_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.artistBlock_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $title = $element.find('.title')

          const name = $title.attr('title')
          let aliases = $title.find('.singer_names').text().trim().match(/^\((.*)\)$/)
          aliases = aliases === null ? [] : aliases[1].split(' / ')
          const id = $title.attr('href').match(/\w+$/)[0]
          const photoURL = url.parse($element.find('.artist100 > img').attr('src').replace(/@.*$/, ''))

          data.push({ id, name, aliases, photoURL })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getArtistIdBySearch (keyword) {
  return new Promise((resolve, reject) => {
    searchArtists(keyword).then((result) => {
      if (result === null) {
        resolve(null)
        return
      }
      resolve(result.data[0].id)
    }).catch((e) => {
      reject(e)
    })
  })
}

function getArtistIdByNameOrSearch (nameOrKeyword) {
  return new Promise((resolve, reject) => {
    getArtistIdByName(nameOrKeyword).then((id) => {
      if (id !== null) {
        resolve(id)
        return
      }

      getArtistIdBySearch(nameOrKeyword).then((id) => {
        if (id === null) {
          resolve(null)
          return
        }

        resolve(id)
      }).catch((e) => {
        reject(e)
      })
    }).catch((e) => {
      reject(e)
    })
  })
}

function getArtistProfile (id) {
  return new Promise((resolve, reject) => {
    const query = (id) => {
      http.get(`http://www.xiami.com/artist/profile-${id}`, (res) => {
        const { statusCode } = res

        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
        }
        if (error) {
          res.resume()
          reject(error)
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)
          const $name = $('#artist_profile > .content > p > a')
          const introduction = _editorTextFormatToString($('#main > .profile').text())
          const name = $name.clone().children().remove().end().text().trim()
          let aliases = $name.find('span').text().trim()
          aliases = aliases === '' ? [] : aliases.split(' / ')

          resolve({ id, introduction, name, aliases })
        })
      }).on('error', (e) => {
        reject(e)
      })
    }

    if (typeof id === 'string') {
      convertArtistStringIdToNumberId(id).then((id) => {
        query(id)
      }).catch((e) => {
        reject(e)
      })
    } else {
      query(id)
    }
  })
}

function getArtistAlbums (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/artist/album-${id}?page=${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.cate_viewmode .counts').text().match(/\d+/)[0])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_ARTIST_ALBUMS_PAGE_ITEMS)

        $('.albumThread_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $name = $element.find('.name')
          const $title = $name.find('a')

          const title = $title.attr('title').trim()
          let subtitle = $name.clone().children().remove().end().text().trim().match(/^\((.*)\)$/)
          subtitle = subtitle === null ? subtitle : subtitle[1]
          const id = parseInt($element.find('.album_item100_thread').attr('id').match(/\d+$/)[0])
          const coverURL = url.parse($element.find('.CDcover100 > img').attr('src').replace(/@.*$/, ''))

          data.push({ id, title, subtitle, coverURL })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getArtistTop100Songs (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/artist/top-${id}?page=${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.all_page > span').text().match(/(\d+).{2}$/)[1])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_ARTIST_TOP100_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.track_list > tbody > tr').each((_, element) => {
          const $element = $(element)
          const $name = $element.find('.song_name > a')

          const title = $name.attr('title').trim()
          const id = parseInt($element.find('input[type="checkbox"]').attr('value'))
          data.push({ id, title })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function convertArtistStringIdToNumberId (stringId) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/artist/similar-${stringId}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const id = parseInt($('.acts > a').attr('href').match(/\d+$/)[0])

        resolve(id)
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getAlbumProfile (id) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/album/${id}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const $title = $('h1')
        const $artist = $('#album_info table tr:first-of-type a')

        const id = parseInt($('#qrcode > .acts').text())
        const title = $title.clone().children().remove().end().text().trim()

        let subtitle = $title.find('span').text().trim()
        subtitle = subtitle === '' ? null : subtitle

        const tracklist = []
        $('#track_list tr[data-needpay]').each((_, element) => {
          const $element = $(element)
          const $input = $element.find('input[type="checkbox"]')
          const $name = $element.find('.song_name')

          const id = parseInt($input.attr('value'))
          const canBePlayed = $input.is(':checked')
          const title = $name.find('a:first-of-type').text().trim()
          let subtitle = $name.find('a:nth-of-type(2)').text().trim()
          subtitle = subtitle === '' ? null : subtitle

          tracklist.push({ id, canBePlayed, title, subtitle })
        })

        const artist = {
          id: parseInt($('#nav > .last').attr('href').match(/\d+$/)[0]),
          name: $artist.text().trim()
        }

        const coverURL = url.parse($('#cover_lightbox > img').attr('src').replace(/@.*$/, ''))
        const introduction = _editorTextFormatToString($('[property="v:summary"]').text().trim())

        resolve({ id, title, subtitle, tracklist, artist, coverURL, introduction })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getSongProfile (id) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/song/${id}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const id = parseInt($('#qrcode .acts').text())
        const title = $('h1').clone().children().remove().end().text().trim()

        let subtitle = $('h1 > span').text().trim()
        subtitle = subtitle === '' ? null : subtitle

        const album = {
          id: parseInt($('#albumCover').attr('href').match(/\d+$/)[0]),
          title: $('#albums_info tr:first-of-type a').text().trim(),
          coverURL: url.parse($('#albumCover').find('img').attr('src').replace(/@.*$/, ''))
        }

        const artists = []
        $('#albums_info tr:nth-of-type(2) a').each((_, element) => {
          const $element = $(element)
          const id = $element.attr('href').match(/\w+$/)[0]
          const name = $element.text().trim()

          artists.push({ id, name })
        })

        resolve({ id, title, subtitle, album, artists })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getTracklist (type, id) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/song/playlist/id/${id}/type/${type}/cat/json`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const parsedData = JSON.parse(rawData)
        const tracklist = []

        if (parsedData.data.trackList === undefined) {
          resolve(tracklist)
          return
        }

        for (const songData of parsedData.data.trackList) {
          const artists = []
          for (const artistData of songData.singersSource) {
            artists.push({ id: artistData.artistId, name: artistData.artistName })
          }

          tracklist.push({
            id: parseInt(songData.songId),
            title: songData.songName,
            subtitle: songData.subName === '' ? null : songData.subName,
            album: {
              id: songData.albumId,
              coverURL: url.parse(songData.album_pic)
            },
            artists,
            audioURL: url.parse(_decodeLocation(songData.location)),
            lyricURL: songData.lyric_url === '' ? null : url.parse(songData.lyric_url)
          })
        }
        resolve(tracklist)
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getSong (id) {
  return getTracklist(TRACKLIST_TYPE_SONG, id)
}

function getArtistTracklist (id) {
  return getTracklist(TRACKLIST_TYPE_ARTIST, id)
}

function getAlbumTracklist (id) {
  return getTracklist(TRACKLIST_TYPE_ALBUM, id)
}

function getFeaturedCollectionTracklist (id) {
  return getTracklist(TRACKLIST_TYPE_FEATURED_COLLECTION, id)
}

function getSongHQAudioURL (id) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'www.xiami.com',
      path: `/song/gethqsong/sid/${id}`,
      headers: {
        'Referer': 'http://www.xiami.com/'
      }
    }, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const parsedData = JSON.parse(rawData)
        let audioURL = null
        if (parsedData.status === 1 && parsedData.location !== '') {
          audioURL = url.parse(_decodeLocation(parsedData.location))
        }
        resolve(audioURL)
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserFavoredSongs (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/space/lib-song/u/${id}/page/${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.counts').text().match(/\d+/)[0])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_USER_FAVORED_SONGS_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.track_list > tbody > tr').each((_, element) => {
          const $element = $(element)
          const $input = $element.find('input[type="checkbox"]')
          const $name = $element.find('.song_name')

          const id = parseInt($input.attr('value'))
          const title = $name.find('a:first-of-type').text().trim()
          const canBePlayed = $input.is(':checked')

          const artists = []
          $name.find('.artist_name').each((_, element) => {
            const $element = $(element)
            const href = $element.attr('href')

            const name = $element.attr('title').trim()
            const id = href.match(/^http:\/\/www\.xiami\.com\/search\/find.*/) !== null ? null : href.match(/\w+$/)[0]
            artists.push({ id, name })
          })

          data.push({ id, canBePlayed, title, artists })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserFavoredAlbums (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/space/lib-album/u/${id}/page/${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.counts').text().match(/\d+/)[0])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_USER_FAVORED_ALBUMS_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.albumThread_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $cover = $element.find('.CDcover100 > img')
          const $artist = $element.find('.name a[href^="/artist/"]')

          const id = parseInt($element.find('.album_item100_thread').attr('rel'))
          const coverURL = url.parse($cover.attr('src').replace(/@.*$/, ''))
          const title = $cover.attr('alt').trim()
          const artist = {
            id: $artist.attr('href').match(/\w+$/)[0],
            name: $artist.attr('title').trim()
          }

          data.push({ id, title, coverURL, artist })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserFavoredFeaturedCollection (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/space/collect-fav/u/${id}/page/${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.counts').text().match(/\d+/)[0])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_USER_FAVORED_ALBUMS_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.collectThread_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $cover = $element.find('.cover img')
          const $author = $element.find('.author > a')

          let coverURL = $cover.attr('src').replace(/@.*$/, '')
          coverURL = coverURL === 'http://pic.xiami.net/res/img/default/collect_default_cover.png' ? null : url.parse(coverURL)

          const title = $cover.attr('alt').trim()
          const id = parseInt($element.attr('id').match(/\d+/)[0])
          const auther = {
            id: parseInt($author.attr('href').match(/\d+/)[0]),
            name: $author.text().trim()
          }

          data.push({ id, title, coverURL, auther })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserCreatedFeaturedCollection (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/space/collect/u/${id}/page/${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.counts').text().match(/\d+/)[0])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_USER_FAVORED_ALBUMS_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.collectThread_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $cover = $element.find('.cover img')

          let coverURL = $cover.attr('src').replace(/@.*$/, '')
          coverURL = coverURL === 'http://pic.xiami.net/res/img/default/collect_default_cover.png' ? null : url.parse(coverURL)

          const title = $cover.attr('alt').trim()
          const id = parseInt($element.find('.name a').attr('href').match(/\d+/)[0])

          data.push({ id, title, coverURL })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserFavoredArtists (id, page = 1) {
  if (page < 1) throw new Error('Argument `page` must more than or equal to 1')
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/space/lib-artist/u/${id}/page/${page}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const total = parseInt($('.counts').text().match(/\d+/)[0])
        if (total === 0) {
          resolve(null)
          return
        }

        const data = []
        const lastPage = Math.ceil(total / MAX_USER_FAVORED_ARTISTS_PAGE_ITEMS)
        if (page > lastPage) {
          resolve(null)
          return
        }

        $('.artistThread_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $photo = $element.find('.artist100 > img')
          const $name = $element.find('.name > a > strong')

          let photoURL = $photo.attr('src').replace(/@.*$/, '')
          photoURL = photoURL === 'http://pic.xiami.net/res/img/default/cd100.gif' ? null : url.parse(photoURL)

          let id = $element.attr('id').match(/\d+/)
          if (id === null) {
            resolve(null)
            return
          }
          id = parseInt(id[0])

          const name = $name.clone().children().remove().end().text().trim()
          let aliases = $name.find('span').text().trim().match(/^\((.*)\)$/)
          aliases = aliases === null ? [] : aliases[1].split(' / ')

          data.push({ id, name, aliases, photoURL })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserProfile (id) {
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/u/${id}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const name = $('h1').text().trim()

        let avatarURL = $('#p_buddy > img').attr('src').replace(/@.*$/, '')
        avatarURL = avatarURL.match(/\/\/pic\.xiami.net\/images\/default\/avatar/) !== null ? null : url.parse(avatarURL)

        const playCounts = parseInt($('.play_count').text().replace('累计播放歌曲：', '').trim())
        const introduction = _editorTextFormatToString($('.tweeting_full').text().trim())
        const registeredDate = new Date($('.gray').text().replace('加入', '').trim())

        resolve({ id, name, avatarURL, playCounts, introduction, registeredDate })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getUserToken (username, password) {
  return new Promise((resolve, reject) => {
    https.get(`https://login.xiami.com/member/login`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if (error) {
        res.resume()
        reject(error)
      }

      const xiamiToken = res.headers['set-cookie'][1].match(/_xiamitoken=(\w+);/)[1]
      res.resume()

      const form = new FormData()
      form.append('_xiamitoken', xiamiToken)
      form.append('account', username)
      form.append('pw', password)

      form.submit({
        protocol: 'https:',
        hostname: 'login.xiami.com',
        path: '/passport/login',
        method: 'POST',
        headers: {
          'Referer': 'https://login.xiami.com/member/login'
        }
      }, (err, res) => {
        if (err) {
          res.resume()
          reject(err)
          return
        }
        const { statusCode } = res

        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
        }
        if (error) {
          res.resume()
          reject(error)
          return
        }

        console.log(res)
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          resolve(rawData)
        })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

module.exports = {
  getFeaturedCollectionProfile,
  getArtistIdByName,
  getArtistIdBySearch,
  getArtistIdByNameOrSearch,
  getArtistProfile,
  getArtistAlbums,
  getArtistTop100Songs,
  getAlbumProfile,
  getSongProfile,
  getSongHQAudioURL,
  getSong,
  getTracklist,
  getArtistTracklist,
  getAlbumTracklist,
  getFeaturedCollectionTracklist,
  getUserFavoredSongs,
  getUserFavoredAlbums,
  getUserFavoredArtists,
  getUserFavoredFeaturedCollection,
  getUserCreatedFeaturedCollection,
  getUserProfile,
  getUserToken,
  convertArtistStringIdToNumberId,
  searchArtists,
  MAX_SEARCH_ARTISTS_PAGE_ITEMS,
  MAX_ARTIST_ALBUMS_PAGE_ITEMS,
  MAX_ARTIST_TOP100_PAGE_ITEMS,
  MAX_USER_FAVORED_SONGS_PAGE_ITEMS,
  MAX_USER_FAVORED_ALBUMS_PAGE_ITEMS,
  MAX_USER_FAVORED_ARTISTS_PAGE_ITEMS,
  TRACKLIST_TYPE_SONG,
  TRACKLIST_TYPE_ALBUM,
  TRACKLIST_TYPE_ARTIST,
  TRACKLIST_TYPE_FEATURED_COLLECTION
}
