const Hapi = require('hapi')
const TwitchEvents = require('../src/main.js')

let isRunning = false
let callbackOnStart = () => {}

const server = new Hapi.Server(Object.assign({
  host: '0.0.0.0',
  port: 3000,
  routes: { cors: true }
}))

let t = new TwitchEvents('test')

server.route({
  method: 'GET',
  path: '/',
  handler: () => 'test'
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
