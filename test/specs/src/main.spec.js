/* global describe it */
/* eslint valid-typeof: 0 */
const assert = require('chai').assert
const TwitchEvent = require('../../../src/main.js')

const expectedEvents = [
  { name: 'id', type: 'string', required: true },
  { name: 'title', type: 'string', required: true },
  { name: 'startAt', instance: Date, required: true },
  { name: 'endAt', instance: Date, required: true },
  { name: 'game', type: 'string', required: true },
  { name: 'streamer', type: 'string', required: true },
  { name: 'description', type: 'string', required: false }
]

const testProperties = function (ev) {
  for (let i = 0; i < expectedEvents.length; ++i) {
    let expectedEvent = expectedEvents[i]
    let propertyValue = ev[expectedEvent.name]
    let hasExpectedProperty = ev.hasOwnProperty(expectedEvent.name)

    let isEmptyString = typeof propertyValue === 'string' && propertyValue.trim() === ''
    let isInvalidType = expectedEvent.hasOwnProperty('type') && hasExpectedProperty && typeof propertyValue !== expectedEvent.type
    let isInvalidInstance = expectedEvent.hasOwnProperty('instance') && hasExpectedProperty && ev.instance instanceof expectedEvent.instance

    if ((expectedEvent.required && (!hasExpectedProperty || isEmptyString)) || isInvalidType || isInvalidInstance) {
      return true
    }
  }

  return false
}

const testsEvents = function (events, hasDescription = false) {
  assert.isTrue(Array.isArray(events.data))
  events.data.forEach((ev) => assert.isFalse(testProperties(ev)))

  if (hasDescription) {
    events.data.forEach((ev) => assert.isTrue(ev.hasOwnProperty('description')))
  }
}

const twitchEvent = new TwitchEvent('heyyiw4txxbrmypyhje24wehmw0qw5', 'lundprod')

describe('Public : TwitchEvent class validity tests', function () {
  it('Test Public: TwitchEvent.getGlobalEvents(false)', async function () {
    const events = await twitchEvent.getGlobalEvents(false)
    testsEvents(events)
  })

  it('Test Public: TwitchEvent.getGlobalEvents(true)', async function () {
    const events = await twitchEvent.getGlobalEvents(true)
    testsEvents(events, true)
  })

  it('Test Public: TwitchEvent.getPastEvents(3, false)', async function () {
    const events = await twitchEvent.getPastEvents(3, false)
    assert.isTrue(events.data.length === 3)
    testsEvents(events)
  })

  it('Test Public: TwitchEvent.getPastEvents(3, true)', async function () {
    const events = await twitchEvent.getPastEvents(3, true)
    assert.isTrue(events.data.length === 3)
    testsEvents(events, true)
  })
})
