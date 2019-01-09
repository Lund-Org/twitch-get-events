/* eslint no-unused-expressions: 0 */

const TwitchEvents = require(path.resolve(__root, './src/main.js'))
const {
  IS_DONE,
  IS_FAIL,
  USER_NOT_FOUND
} = require(path.resolve(__root, './src/constants.js'))

const TWITCH_TOKEN = process.env.TWITCH_TOKEN
const TWITCH_USERNAME = process.env.TWITCH_USERNAME
const TWITCH_USERNAME_EMPTY = process.env.TWITCH_USERNAME_EMPTY
const TWITCH_USERNAME_NOT_FOUND = process.env.TWITCH_USERNAME_NOT_FOUND
const SHOULD_NOT_THROW = 'This test should not throw an Error...'
const SHOULD_NOT_NEXT = 'This test should not continue...'

function checkDoneResponse (res) {
  expect(res).to.have.property('state', IS_DONE)
  expect(res).to.have.not.property('error')
  expect(res).to.have.property('data')
  expect(res.data).to.be.an('array').to.not.be.empty
  const event = res.data.shift()
  expect(event).to.be.an('object').to.not.be.empty
  expect(event).to.have.property('id').to.be.a('string').to.not.be.empty
  expect(event).to.have.property('title').to.be.a('string').to.not.be.empty
  expect(event).to.have.property('startAt').to.be.a('date')
  expect(event).to.have.property('endAt').to.be.a('date')
  expect(event).to.have.property('game').to.be.a('string').to.not.be.empty
  expect(event).to.have.property('streamer').to.be.a('string').to.not.be.empty
  return event
}

function checkDoneEmptyResponse (res) {
  expect(res).to.have.property('state', IS_DONE)
  expect(res).to.have.not.property('error')
  expect(res).to.have.property('data')
  expect(res.data).to.be.an('array').to.be.empty
}

function checkFailResponse (res, code) {
  expect(res).to.have.property('state', IS_FAIL)
  expect(res).to.have.property('code', code)
  expect(res).to.have.not.property('error')
  expect(res).to.have.property('data')
  expect(res.data).to.be.an('array').to.be.empty
}

// function checkErrorResponse (err, code) {
//   expect(err).to.have.property('state', IS_ERR)
//   expect(res).to.have.property('code', code)
//   expect(err).to.have.not.property('data')
//   expect(err).to.have.property('details')
//   expect(err.details).to.not.to.be.empty
// }

describe('TwitchEvents constructor()', () => {
  it('throw an TypeError when the "clientId" argument is not type string', () => {
    try {
      const twitchEvents = new TwitchEvents({ state: 'object' })
      assert.fail(SHOULD_NOT_NEXT, twitchEvents)
    } catch (err) {
      expect(err).to.be.an.instanceOf(TypeError)
    }
  })

  it('work fine when the "clientId" argument is provided as string', () => {
    try {
      const twitchEvents = new TwitchEvents('string')
      expect(twitchEvents.clientId).to.be.a('string').to.not.be.empty
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})

describe('TwitchEvents getNextEvents()', () => {
  // it('reject an error object with state IS_ERR and code REQUEST_ERROR', async () => {
  //   try {
  //     const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
  //     const response = await twitchEvents.getNextEvents(TWITCH_USERNAME)
  //     assert.fail(SHOULD_NOT_NEXT, response)
  //   } catch (err) {
  //     await checkErrorResponse(err, REQUEST_ERROR)
  //   }
  // })

  it('work fine and return a IS_DONE state response when user has events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getNextEvents(TWITCH_USERNAME)
      const event = await checkDoneResponse(response)
      expect(event).to.have.property('description', null)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when event has description', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getNextEvents(TWITCH_USERNAME, true)
      const event = await checkDoneResponse(response)
      expect(event).to.have.property('description').to.be.a('string')
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when user has not events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getNextEvents(TWITCH_USERNAME_EMPTY)
      await checkDoneEmptyResponse(response)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_FAIL state and USER_NOT_FOUND code response', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getNextEvents(TWITCH_USERNAME_NOT_FOUND)
      await checkFailResponse(response, USER_NOT_FOUND)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})

describe('TwitchEvents getGlobalEvents() (depreciation) (alias of getNextEvents())', () => {
  it('work fine and return a fullified response when user is found and has events', () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getGlobalEvents(TWITCH_USERNAME)
      await checkDoneResponse(response)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})

describe('TwitchEvents getPastEvents()', () => {
  // it('reject an error object with state IS_ERR and code REQUEST_ERROR', async () => {
  //   try {
  //     const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
  //     const response = await twitchEvents.getPastEvents(TWITCH_USERNAME)
  //     assert.fail(SHOULD_NOT_NEXT, response)
  //   } catch (err) {
  //     await checkErrorResponse(err, REQUEST_ERROR)
  //   }
  // })

  it('work fine and return a IS_DONE state response when user has events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME)
      const event = await checkDoneResponse(response)
      expect(event).to.have.property('description', null)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when event has description', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME, true)
      const event = await checkDoneResponse(response)
      expect(event).to.have.property('description').to.be.a('string')
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when user has not events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME_EMPTY)
      await checkDoneEmptyResponse(response)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_FAIL state and USER_NOT_FOUND code response', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME_NOT_FOUND)
      await checkFailResponse(response, USER_NOT_FOUND)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})
