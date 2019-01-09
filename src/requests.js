const https = require('https')
const { isObject } = require('./sugars.js')

/**
 * HTTPS post request.
 * @param {object} options - The request options.
 * @param {object} [data={}] - The request post data.
 * @returns {Promise<TypeError,object>}
 */
function post (options, data = {}) {
  return new Promise((resolve, reject) => {
    if (!isObject(data)) {
      return reject(new TypeError('The "data" argument must be an object.'))
    }
    const request = https.request(options, (res) => {
      res.setEncoding('utf8')
      res.chunks = []
      res.on('data', res.chunks.push.bind(res.chunks))
      res.once('end', () => {
        res.parsedData = JSON.parse(res.chunks.join(''))
        res.statusCode !== 200 ? reject(res.parsedData) : resolve(res.parsedData)
      })
    })
    request.once('error', reject)
    request.write(JSON.stringify(data))
    request.end()
  })
}

module.exports = {
  post
}
