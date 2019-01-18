const https = require('https')

/**
 * HTTPS post request.
 * @async
 * @param {object} options - The request options.
 * @param {object} data - The request post data.
 * @returns {Promise<object>}
 */
async function post (options, data) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, (res) => {
      res.setEncoding('utf8')
      res.chunks = []
      res.on('data', res.chunks.push.bind(res.chunks))
      res.on('end', () => {
        res.parsedData = JSON.parse(res.chunks.join(''))

        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(res.parsedData)
        }

        resolve(res.parsedData)
      })
    })
    request.on('error', reject)
    request.write(JSON.stringify(data))
    request.end()
  })
}

module.exports = {
  post
}
