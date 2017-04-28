const http = require('http')

module.exports = (id, callback) => {
  http.get(`http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`, (res) => {
    const { statusCode } = res
    const contentType = res.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`)
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
      try {
        const parsedData = JSON.parse(rawData)
        if (parsedData.message !== null) {
          callback(new Error(parsedData.message))
          return
        }
        callback(null, parsedData)
      } catch (e) {
        callback(e)
      }
    })
  }).on('error', (e) => {
    callback(e)
  })
}
