/* global describe it */
/* eslint valid-typeof: 0 */
const assert = require('chai').assert
const puppeteer = require('puppeteer')
const TwitchEvent = require('../../../src/main.js')

const expectedEvents = [
  { name: 'link', type: 'string', required: true },
  { name: 'title', type: 'string', required: true },
  { name: 'date', type: 'string', required: true },
  { name: 'game', type: 'string', required: true },
  { name: 'streamer', type: 'string', required: true },
  { name: 'description', type: 'string', required: false }
]

const testProperties = function (ev) {
  let error = false

  for (let i = 0; i < expectedEvents.length; ++i) {
    let expectedEvent = expectedEvents[i]
    let propertyValue = ev[expectedEvent.name]
    let hasExpectedProperty = ev.hasOwnProperty(expectedEvent.name)
    if ((expectedEvent.required && (!hasExpectedProperty || propertyValue.trim() === '')) ||
      (hasExpectedProperty && typeof propertyValue !== expectedEvent.type)) {
      error = true
      break
    }
  }

  return error
}

const testsEvents = function (events) {
  assert.isTrue(Array.isArray(events))
  events.forEach((ev) => {
    assert.isFalse(testProperties(ev))
  })
}

const twitchEvent = new TwitchEvent('lundprod')

describe('Public : TwitchEvent class validity tests', function () {
  it('Test Public: TwitchEvent.getGlobalEvents(false)', async function () {
    this.timeout(10000)
    const events = await twitchEvent.getGlobalEvents(false)
    testsEvents(events)
  })

  it('Test Public: TwitchEvent.getGlobalEvents(true)', async function () {
    this.timeout(100000)
    const events = await twitchEvent.getGlobalEvents(true)
    testsEvents(events)
  })
})

describe('Private : TwitchEvent class validity tests', function () {
  const createBrowser = function () {
    const browser = puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    return browser
  }

  it('Test Private: TwitchEvent._getPage(browser, target)', async function () {
    this.timeout(10000)
    const browser = await createBrowser()
    const page = await twitchEvent._getPage(browser, 'https://google.com')
    assert.isTrue(typeof page === 'object' && page.constructor.name === 'Page')
    await browser.close()
  })

  it('Test Private: TwitchEvent._getDescriptions(browser, events)', async function () {
    this.timeout(25000)
    const browser = await createBrowser()
    let events = await twitchEvent.getGlobalEvents(false)
    events = await twitchEvent._getDescriptions(browser, events)
    const errors = events.map((ev) => typeof ev.description === 'string')
    assert.isFalse(errors.includes(false))
    await browser.close()
  })

  it('Test Private: TwitchEvent._extractDescription(page)', async function () {
    // To reset it after
    let previousGlobalDocument = global.document
    // Because it's used in extractDescription
    global.document = {
      querySelector: () => {
        return { innerText: 'Foobar' }
      }
    }
    // Because we don't want to load a full page
    let pageSimultor = {
      evaluate: (method) => {
        return method()
      }
    }
    let events = [{ description: null }]

    events[0].description = await twitchEvent._extractDescription(pageSimultor)
    const errors = events.map((ev) => typeof ev.description === 'string')
    assert.isFalse(errors.includes(false))
    // Reset
    global.document = previousGlobalDocument
  })

  it('Test Private: TwitchEvent._extractEvents(page, 3)', async function () {
    this.timeout(25000)
    const browser = await createBrowser()
    const page = await twitchEvent._getPage(browser, 'https://www.twitch.tv/lundprod/events?filter=past')
    const events = await twitchEvent._extractEvents(page, 3)
    assert.isTrue(events.length === 3)
    await testsEvents(events)
    await browser.close()
  })
})
