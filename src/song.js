const http = require('http')
const cheerio = require('cheerio')
const Album = require('./album')
const Artist = require('./artist')

class Song {
  constructor (id) {
    this._id = id
  }

  get id () {
    return this._id
  }

  get name () {
    return this._name
  }

  get album () {
    return this._album
  }

  get artists () {
    return this._artists
  }

  _get () {
    return new Promise((resolve, reject) => {
      http.get(`http://www.xiami.com/song/${this.id}`, (res) => {
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
          this._id = parseInt($('#qrcode > .acts').text().trim())
          this._name = $('#title > h1').clone().children().remove().end().text().trim()
          this._album = new Album(parseInt($('#albumCover').attr('href').match(/\d+/)[0]))
          this._artists = []

          const self = this
          $('td:contains("演唱者：") + td a').each(function () {
            self._artists.push(new Artist($(this).attr('href').match(/\w+$/)[0]))
          })
          resolve()
        })
      }).on('error', (e) => {
        reject(e)
      })
    })
  }
}

module.exports = Song
