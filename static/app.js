const Hapi = require('hapi')
const TwitchEvents = require('../src/main.js')

const server = new Hapi.Server(Object.assign({
  host: '0.0.0.0',
  port: 3000,
  routes: { cors: true }
}))

let t = new TwitchEvents()

server.route({
  method: 'GET',
  path: '/',
  handler: t.get
})

server.start().then(() => {
  console.log('It works ! Check it here : http://localhost:19900 (docker) or http://localhost:3000 (local)')
}).catch((err) => {
  console.log('It failed !')
  console.log(err)
})
