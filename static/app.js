const Hapi = require('hapi')
const TwitchEvents = require('../src/main.js')

let isRunning = false
let callbackOnStart = () => {}

const server = new Hapi.Server(Object.assign({
  host: '0.0.0.0',
  port: 3000,
  routes: { cors: true }
}))

server.route({
  method: 'GET',
  path: '/global/{clientId}/{username}',
  handler: async (request, handler) => {
    const twitchEvent = await new TwitchEvents(
      encodeURIComponent(request.params.clientId),
      encodeURIComponent(request.params.username)
    )
    return await twitchEvent.getGlobalEvents(
      typeof request.query.description !== 'undefined' && request.query.description.toLowerCase() === 'y'
    )
  }
})

server.route({
  method: 'GET',
  path: '/past/{clientId}/{username}',
  handler: async (request, handler) => {
    const twitchEvent = await new TwitchEvents(
      encodeURIComponent(request.params.clientId),
      encodeURIComponent(request.params.username)
    )
    return await twitchEvent.getPastEvents(
      typeof request.query.offset === 'string' && request.query.offset.match(/[0-9]+/)
        ? request.query.offset
        : null,
      typeof request.query.description !== 'undefined' && request.query.description.toLowerCase() === 'y'
    )
  }
})

server.start().then(() => {
  isRunning = true
  callbackOnStart()
  console.log('It works ! Check it here : http://localhost:19900 (docker) or http://localhost:3000 (local)')
}).catch((err) => {
  isRunning = false
  console.log('It failed !')
  console.log(err)
})

// For unit test purposes
module.exports = {
  isServerRunning: () => {
    return isRunning
  },
  setCallbackOnStart: (method) => {
    callbackOnStart = method
  },
  getServer: () => {
    return server
  }
}
