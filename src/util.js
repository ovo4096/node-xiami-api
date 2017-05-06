const http = require('http')
const cheerio = require('cheerio')
const url = require('url')
const htmlToText = require('html-to-text')

module.exports = class Util {
  /**
   * The decoding method is implemented by https://github.com/Flowerowl/xiami/blob/master/xiami.php
   */
  static decodeLocation (location) {
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

  static getSongInfo (id) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/song/${id}`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)
          const artistIds = []
          $('td:contains("演唱者：") + td a').each((_, element) => {
            artistIds.push($(element).attr('href').match(/\w+$/)[0])
          })
          const id = parseInt($('#qrcode > .acts').text().trim())
          const title = $('#title > h1').clone().children().remove().end().text().trim()
          let subtitle = $('#title > h1 > span').clone().children().remove().end().text().trim()
          subtitle = subtitle === '' ? null : subtitle
          const albumId = parseInt($('#albumCover').attr('href').match(/\d+/))

          resolve({ id, title, subtitle, albumId, artistIds })
        })
      }).on('error', (e) => {
        reject(e)
      })
    })
  }

  static getSongAudioURL (id) {
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
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            let audioURL = null
            if (parsedData.status === 1 && parsedData.location !== '') {
              audioURL = url.parse(Util.decodeLocation(parsedData.location))
            }
            resolve(audioURL)
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', (e) => {
        reject(e)
      })
    })
  }

  static getSongLyricsURL (id) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            let lyricsURL = null
            if (parsedData.status === true && parsedData.message === null && parsedData.data.trackList[0].lyric_url !== '') {
              lyricsURL = url.parse(parsedData.data.trackList[0].lyric_url)
            }
            resolve(lyricsURL)
          } catch (e) { reject(e) }
        })
      }).on('error', (e) => { reject(e) })
    })
  }

  static getSong (id) {
    return new Promise((resolve, reject) => {
      Util.getSongInfo(id).then(({ id, title, subtitle, albumId, artistIds }) => {
        Promise.all([
          Util.getSongAudioURL(id),
          Util.getSongLyricsURL(id)
        ]).then((values) => {
          resolve(new Song({
            id,
            title,
            subtitle,
            albumId,
            artists: new LazyLoadCollection(Util.getArtist, artistIds),
            audioURL: values[0],
            lyricsURL: values[1]
          }))
        }).catch((e) => { reject(e) })
      }).catch((e) => { reject(e) })
    })
  }

  static getAlbum (id) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/album/${id}`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)

          const id = parseInt($('#qrcode > .acts').text().trim())
          const title = $('#title > h1').clone().children().remove().end().text().trim()
          let subtitle = $('#title > h1 > span').clone().children().remove().end().text().trim()
          subtitle = subtitle === '' ? null : subtitle
          const tracklistIds = []
          $('#track .chkbox > input').each((_, element) => {
            tracklistIds.push(parseInt($(element).attr('value')))
          })
          const artistId = $('td:contains("艺人：") + td a').attr('href').match(/\w+$/)[0]
          const coverURL = url.parse($('#cover_lightbox').attr('href'))
          const description = htmlToText.fromString($('#album_intro [property="v:summary"]').text())
          resolve(new Album({
            id,
            title,
            subtitle,
            tracklist: new LazyLoadCollection(Util.getSong, tracklistIds),
            artistId,
            coverURL,
            description
          }))
        })
      }).on('error', (e) => { reject(e) })
    })
  }

  static getArtistInfo (id) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/artist/album-${id}`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)

          const name = $('#artist_profile > .content.clearfix > p > a').clone().children().remove().end().text().trim()
          const alias = $('#artist_profile > .content.clearfix > p > a > span').clone().children().remove().end().text().trim()
          let photoURL = url.parse($('#artist_profile > .content.clearfix > a > img').attr('src').replace('_3', ''))
          if (photoURL.href === 'http://img.xiami.net/res/img/default/cd100.gif') {
            photoURL = null
          }
          const id = parseInt($('#nav > a[href^="/artist/profile-"]').attr('href').match(/\d+$/)[0])
          resolve({ id, name, alias, photoURL })
        })
      }).on('error', (e) => { reject(e) })
    })
  }

  static getArtistDescription (id) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/artist/profile-${id}`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)
          const description = htmlToText.fromString($('#main > .profile').html())
          resolve(description)
        })
      }).on('error', (e) => { reject(e) })
    })
  }

  static get artistAlbumsPerPage () {
    return 9
  }

  static getArtistAlbumIds (id, page = 1) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/artist/album-${id}?page=${page}`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)
          const ids = []
          $('.album_item100_thread a.preview').each((_, element) => {
            ids.push(parseInt($(element).attr('id')))
          })
          let total = parseInt($('.cate_viewmode .counts').text().match(/\d+/))
          resolve({ ids, total })
        })
      }).on('error', (e) => { reject(e) })
    })
  }

  static get artistTop100SongsPerPage () {
    return 20
  }

  static getArtistTop100SongIds (id, page = 1) {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/artist/top-${id}?page=${page}`, (res) => {
        const { statusCode } = res
        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
        }
        if (error) {
          reject(error)
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          const $ = cheerio.load(rawData)
          const ids = []
          $('input[name="ids"]').each((_, element) => {
            ids.push(parseInt($(element).attr('value')))
          })
          let total = $('.all_page > span').text()
          total = total === '' ? 0 : parseInt(total.match(/(\d+)\W*\)$/)[1])
          resolve({ ids, total })
        })
      }).on('error', (e) => { reject(e) })
    })
  }

  static getArtist (id) {
    return new Promise((resolve, reject) => {
      Util.getArtistInfo(id).then(({
        id,
        name,
        alias,
        photoURL
      }) => {
        Promise.all([
          PaginationLazyLoadCollection.create(
            Util.getAlbum,
            (page) => Util.getArtistAlbumIds(id, page),
            Util.artistAlbumsPerPage
          ),
          PaginationLazyLoadCollection.create(
            Util.getSong,
            (page) => Util.getArtistTop100SongIds(id, page),
            Util.artistTop100SongsPerPage
          ),
          Util.getArtistDescription(id)
        ]).then((values) => {
          resolve(new Artist({
            id,
            name,
            alias,
            photoURL,
            albums: values[0],
            top100Songs: values[1],
            description: values[2]
          }))
        }).catch((e) => { reject(e) })
      }).catch((e) => { reject(e) })
    })
  }
}

const Song = require('./song')
const Album = require('./album')
const Artist = require('./artist')
const LazyLoadCollection = require('./_lazy-load-collection')
const PaginationLazyLoadCollection = require('./_pagination-lazy-load-collection')
