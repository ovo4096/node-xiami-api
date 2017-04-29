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

  static get (id, callback) {
    http.get(`http://www.xiami.com/song/${id}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
      }

      if (error) {
        callback(error)
        res.resume()
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        const song = new Song(parseInt($('#qrcode > .acts').text().trim()))

        song._name = $('#title > h1').clone().children().remove().end().text().trim()
        song._album = new Album(parseInt($('#albumCover').attr('href').match(/\d+/)[0]))
        song._artists = []

        $('td:contains("演唱者：") + td a').each(function () {
          song._artists.push(new Artist($(this).attr('href').match(/\w+$/)[0]))
        })

        callback(null, song)
      })
    }).on('error', (e) => {
      callback(e)
    })
  }
}

module.exports = Song
