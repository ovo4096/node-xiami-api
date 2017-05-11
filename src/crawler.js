const http = require('http')
const url = require('url')
const cheerio = require('cheerio')

const MAX_SEARCH_ARTISTS_PAGE_ITEMS = 30
const MAX_ARTIST_ALBUMS_PAGE_ITEMS = 12

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
  if (isNaN(parseInt(id))) throw new Error('Argument `id` must be a numeric type')
  return new Promise((resolve, reject) => {
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
        const introduction = $('#main > .profile').html()
        const name = $name.clone().children().remove().end().text().trim()
        let aliases = $name.find('span').text().trim()
        aliases = aliases === '' ? [] : aliases.split(' / ')

        resolve({ id, introduction, name, aliases })
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

function getArtistAlbums (id, page = 1) {
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

module.exports = {
  getFeaturedCollection,
  getArtistIdByName,
  getArtistIdBySearch,
  getArtistIdByNameOrSearch,
  getArtistProfile,
  getArtistAlbums,
  searchArtists,
  MAX_SEARCH_ARTISTS_PAGE_ITEMS,
  MAX_ARTIST_ALBUMS_PAGE_ITEMS
}
