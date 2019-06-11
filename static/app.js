// Example usage.
const Hapi = require('hapi')
const TwitchEvents = require('../src/index.js')

const twitchEvent = new TwitchEvents()
const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 3000,
  routes: { cors: true }
})

server.route({
  method: 'GET',
  path: '/upcoming/{username}',
  handler: async (request, handler) => {
    const username = encodeURIComponent(request.params.username)
    const { description, offset, limit } = getQueries(request.query)
    return twitchEvent.getUpcomingEvents(username, description, offset, limit)
  }
})

server.route({
  method: 'GET',
  path: '/past/{username}',
  handler: async (request, handler) => {
    const username = encodeURIComponent(request.params.username)
    const { description, offset, limit } = getQueries(request.query)
    return twitchEvent.getPastEvents(username, description, offset, limit)
  }
})

server.start().then(() => {
  console.log('It works ! Check it here : http://localhost:19900 (docker) or http://localhost:3000 (local)')
}).catch((err) => {
  console.log(err)
})

function getQueries ({ description, offset, limit }) {
  return {
    description: typeof description !== 'undefined' && description.toLowerCase() === 'y',
    offset: typeof offset === 'string' && offset.match(/[0-9]+/) ? parseInt(offset) : 0,
    limit: typeof limit === 'string' && limit.match(/[0-9]+/) ? parseInt(limit) : 20
  }
}
