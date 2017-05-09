const http = require('http')
const cheerio = require('cheerio')
const MAX_SEARCH_ARTISTS_PAGE_ITEMS = 30

function getFeaturedCollection (id) {
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

        const title = $('h2').text().trim()
        const tracklist = []
        const auther = {
          id: parseInt($('h4 > a').attr('name_card')),
          name: $('h4 > a').text().trim()
        }
        const introduction = $('.info_intro_full').text()
        const id = parseInt($('#qrcode > span').text())

        $('.quote_song_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $input = $element.find('input[type="checkbox"]')

          const id = parseInt($input.attr('value'))
          const canPlay = $input.is(':checked')
          const title = canPlay
                          ? $element.find('.song_toclt').attr('title').trim().match(/^添加(.*)到歌单$/)[1]
                          : $element.find('.song_name').clone().children().remove().end().text().trim().match(/^(.*)\s--\s*;*$/)[1]
          const artists = []
          let introduction = $element.find('#des_').text().trim()
          introduction = introduction === '' ? null : introduction

          $element.find('.song_name > a[href^="/artist/"], .song_name > a[href^="http://www.xiami.com/search/find"]').each((_, element) => {
            const $element = $(element)
            const href = $element.attr('href')

            const name = $element.text().trim()
            const id = href.match(/^http:\/\/www\.xiami\.com\/search\/find.*/) === null ? null : href.match(/\w+$/)[0]
            artists.push({ name, id })
          })

          tracklist.push({ id, title, artists, introduction, canPlay })
        })
        resolve({
          id,
          title,
          auther,
          introduction,
          tracklist
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
        console.log(encodeURIComponent(name))
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
  return new Promise((resolve, reject) => {
    http.get(`http://www.xiami.com/search/artist/page/${page}?key=${encodeURIComponent(keyword)}`, (res) => {
      const { statusCode } = res

      let error
      if (statusCode !== 200) {
        console.log(encodeURIComponent(keyword))
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

        $('.artistBlock_list > ul > li').each((_, element) => {
          const $element = $(element)
          const $title = $element.find('.title')

          const name = $title.attr('title')
          let aliases = $title.find('.singer_names').text().trim().match(/^\((.*)\)$/)
          aliases = aliases === null ? [] : aliases[1].split(' / ')
          const id = $title.attr('href').match(/\w+$/)[0]

          data.push({ id, name, aliases })
        })

        resolve({ total, lastPage, page, data })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

module.exports = {
  getFeaturedCollection,
  getArtistIdByName,
  searchArtists,
  MAX_SEARCH_ARTISTS_PAGE_ITEMS
}
