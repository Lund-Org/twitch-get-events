/* eslint no-unused-expressions: 0 */

const TwitchEvents = require(path.resolve(__root, './src/index.js'))
const {
  IS_DONE,
  IS_FAIL,
  USER_NOT_FOUND,
  ERROR_REQUEST,
  EVENTS_PAST
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
  expect(res).to.have.property('events')
  expect(res.events).to.be.an('array').to.not.be.empty

  const event = res.events.shift()
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
  expect(res).to.have.property('events')
  expect(res.events).to.be.an('array').to.be.empty
}

function checkFailResponse (res, code) {
  expect(res).to.have.property('state', IS_FAIL)
  expect(res).to.have.property('code', code)
  expect(res).to.have.not.property('error')
}

function checkErrorResponse (err, code) {
  // console.error(err, code)
  expect(err).to.have.property('code', code)
  expect(err).to.have.property('details')
  expect(err.details).to.not.to.be.empty
}

describe('TwitchEvents ::init()', () => {
  it('throw an TypeError when the "clientId" argument is not type string', () => {
    try {
      const twitchEvents = TwitchEvents.init({ state: 'object' })
      assert.fail(SHOULD_NOT_NEXT, twitchEvents)
    } catch (err) {
      expect(err).to.be.an.instanceOf(TypeError)
    }
  })

  it('work fine when the "clientId" argument is provided as string', () => {
    try {
      const twitchEvents = TwitchEvents.init('string')
      expect(twitchEvents.clientId).to.be.a('string').to.not.be.empty
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})

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

describe('TwitchEvents getUpcomingEvents()', () => {
  it('work fine and return IS_FAIL state when the token is not valid', async () => {
    try {
      const twitchEvents = new TwitchEvents('INVALID_TOKEN')
      const response = await twitchEvents.getUpcomingEvents(TWITCH_USERNAME)
      await checkFailResponse(response, ERROR_REQUEST)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when user has events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getUpcomingEvents(TWITCH_USERNAME)
      await checkDoneResponse(response)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when event has description', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getUpcomingEvents(TWITCH_USERNAME, true)
      const event = await checkDoneResponse(response)
      expect(event).to.have.property('description').to.be.a('string')
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when user has not events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getUpcomingEvents(TWITCH_USERNAME_EMPTY)
      await checkDoneEmptyResponse(response)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_FAIL state and USER_NOT_FOUND code response', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getUpcomingEvents(TWITCH_USERNAME_NOT_FOUND)
      await checkFailResponse(response, USER_NOT_FOUND)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})

describe('TwitchEvents getGlobalEvents() (depreciation) (alias of getUpcomingEvents())', () => {
  it('work fine and return a fullified response when user is found and has events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getGlobalEvents(TWITCH_USERNAME)
      await checkDoneResponse(response, ERROR_REQUEST)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })
})

describe('TwitchEvents getPastEvents()', () => {
  it('work fine and return error object when "username" is not found', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(false, 'is-string')
      await checkFailResponse(response, USER_NOT_FOUND)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return object with code ERROR_REQUEST when the twitch token is not valid', async () => {
    try {
      const twitchEvents = new TwitchEvents('INVALID_TOKEN')
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME)
      await checkErrorResponse(response, ERROR_REQUEST)
    } catch (err) {
      assert.fail(SHOULD_NOT_THROW, err)
    }
  })

  it('work fine and return a IS_DONE state response when user has events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME)
      await checkDoneResponse(response)
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

  it('work fine and return a IS_DONE state response when user has large amount of events', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents.getPastEvents(TWITCH_USERNAME, false, 210)
      await checkDoneResponse(response)
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

describe('TwitchEvents _getEvents()', () => {
  it('reject an error when the "offset" argument is not valid', async () => {
    try {
      const twitchEvents = new TwitchEvents(TWITCH_TOKEN)
      const response = await twitchEvents._getEvents(
        TWITCH_USERNAME,
        EVENTS_PAST,
        false,
        'not-integer-format'
      )
      assert.fail(SHOULD_NOT_NEXT, response)
    } catch (err) {
      expect(err).to.have.property(
        'message',
        'The "offset" argument must be an integer or a string integer.'
      )
    }
  })
})
