const http = require('http')
const cheerio = require('cheerio')
const URL = require('url').URL
const Song = require('./song')
const decodeLocation = require('./decode-location')

module.exports = class {
  static getSong (id) {
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
                  audioURL = new URL(decodeLocation(parsedData.location))
                }
                const artistIds = []
                $('td:contains("演唱者：") + td a').each(function () {
                  artistIds.push($(this).attr('href').match(/\w+$/)[0])
                })
                const song = new Song({
                  id: parseInt($('#qrcode > .acts').text().trim()),
                  name: $('#title > h1').clone().children().remove().end().text().trim(),
                  albumId: parseInt($('#albumCover').attr('href').match(/\d+/)),
                  artistIds,
                  audioURL
                })

                resolve(song)
              } catch (e) {
                reject(e)
              }
            })
          }).on('error', (e) => {
            reject(e)
          })
        })
      }).on('error', (e) => {
        reject(e)
      })
    })
  }

  static getAlbum (id) {}
}
