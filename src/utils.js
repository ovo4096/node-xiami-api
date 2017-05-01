const http = require('http')
const cheerio = require('cheerio')
const url = require('url')
const Song = require('./song')

module.exports = class {
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
          $('td:contains("演唱者：") + td a').each(function () {
            artistIds.push($(this).attr('href').match(/\w+$/)[0])
          })
          const id = parseInt($('#qrcode > .acts').text().trim())
          const name = $('#title > h1').clone().children().remove().end().text().trim()
          const albumId = parseInt($('#albumCover').attr('href').match(/\d+/))

          resolve({ id, name, albumId, artistIds })
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
              audioURL = url.parse(this.decodeLocation(parsedData.location))
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
      this.getSongInfo(id).then(({ id, name, albumId, artistIds }) => {
        Promise.all([ this.getSongAudioURL(id), this.getSongLyricsURL(id) ]).then((values) => {
          const song = new Song({
            id,
            name,
            albumId,
            artistIds,
            audioURL: values[0],
            lyricsURL: values[1]
          })
          resolve(song)
        }).catch((e) => { reject(e) })
      }).catch((e) => { reject(e) })
    })
  }
}
