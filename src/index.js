const http = require('http')
const cheerio = require('cheerio')
const Song = require('./song')

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
          const song = new Song()
          song._id = parseInt($('#qrcode > .acts').text().trim())
          song._name = $('#title > h1').clone().children().remove().end().text().trim()
          song._albumId = parseInt($('#albumCover').attr('href').match(/\d+/)[0])
          song._artistIds = []
          $('td:contains("演唱者：") + td a').each(function () {
            song._artistIds.push($(this).attr('href').match(/\w+$/)[0])
          })
          resolve(song)
        })
      }).on('error', (e) => {
        reject(e)
      })
    })
  }

  static getAlbum (id) {}
}
