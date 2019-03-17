// Example usage.
const Hapi = require('hapi')
const TwitchEvents = require('../src/index.js')

const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 3000,
  routes: { cors: true }
})

server.route({
  method: 'GET',
  path: '/upcoming/{clientId}/{username}',
  handler: async (request, handler) => {
    try {
      const clientId = encodeURIComponent(request.params.clientId)
      const username = encodeURIComponent(request.params.username)
      const desc = typeof request.query.description !== 'undefined' &&
        request.query.description.toLowerCase() === 'y'
      const twitchEvent = await new TwitchEvents(clientId)
      return twitchEvent.getUpcomingEvents(username, desc)
    } catch (err) {
      console.error(err)
    }
  }
})

server.route({
  method: 'GET',
  path: '/past/{clientId}/{username}',
  handler: async (request, handler) => {
    const clientId = encodeURIComponent(request.params.clientId)
    const username = encodeURIComponent(request.params.username)
    const twitchEvent = await new TwitchEvents(clientId)
    const desc = typeof request.query.description !== 'undefined' &&
      request.query.description.toLowerCase() === 'y'
    const offset = typeof request.query.offset === 'string' && request.query.offset.match(/[0-9]+/)
      ? request.query.offset
      : null
    return twitchEvent.getPastEvents(username, desc, offset)
  }
})

server.start().then(() => {
  console.log('It works ! Check it here : http://localhost:19900 (docker) or http://localhost:3000 (local)')
}).catch((err) => {
  console.log(err)
})
