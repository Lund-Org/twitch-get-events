const puppeteer = require('puppeteer')

/**
 * Class TwitchEvent.
 * @class TwitchEvent
 */
class TwitchEvent {
  /**
   * Class constructor.
   * @param {string} username - The twitch username.
   */
  constructor (username) {
    if (typeof username !== 'string') {
      throw new Error('Error while trying to instanciate TwitchEvent class, "username" parameter should be string.')
    }
    this.username = username
  }

  /**
   * Method used to extract globals events from twitch user.
   * @param {boolean} [hasDescription=false] - The event description extraction state.
   * @returns {Array<object>} Representing the globals events list.
   */
  getGlobalEvents (hasDescription = false) {
    return this._getEvents(`https://www.twitch.tv/${this.username}/events`, null, hasDescription)
  }

  /**
   * Method used to extract past events from twitch user.
   * @param {null|number} [offset=null] - Representing the number of events needed.
   * @param {boolean} [hasDescription=false] - Representing the event description extraction state.
   * @returns {Array<object>} Representing the past events list.
   */
  getPastEvents (offset = null, hasDescription = false) {
    return this._getEvents(`https://www.twitch.tv/${this.username}/events?filter=past`, offset, hasDescription)
  }

  /**
   * Internal private method used to extract needed events.
   * @param {string} target - Representing the target url.
   * @param {null|number} offset - Representing the number of events needed.
   * @param {boolean} hasDescription - Representing the event description extraction state.
   * @returns {Array<object>} Representing the events list.
   */
  async _getEvents (target, offset, hasDescription) {
    let events

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      })
      const page = await this._getPage(browser, target)
      events = await this._extractEvents(page, offset)
      events = hasDescription ? await this._getDescriptions(browser, events) : events
      await browser.close()
    } catch (error) {
      console.log(error)
    }
    return events
  }

  /**
   * Internal private async method used to create new page and goto targeted url.
   * @param {Browser} browser - Representing the puppeteer browser instance.
   * @param {string} target - Representing the target url.
   * @returns {Page} Representing new page instance created by browser (puppeteer).
   */
  async _getPage (browser, target) {
    const page = await browser.newPage()
    await page.goto(target, { waitUntil: 'networkidle2' })
    return page
  }

  /**
   * Internal private async method used to assign description for each event.
   * @param {Browser} browser - Representing the puppeteer browser instance.
   * @param {Array<object>} events - Representing the events list.
   * @returns {Array<object>} Representing the updated events list.
   */
  async _getDescriptions (browser, events) {
    for (let i = 0; i < events.length; ++i) {
      const page = await this._getPage(browser, events[i].link)
      events[i].description = await this._extractDescription(page)
      await page.close()
    }
    return events
  }

  /**
   * Internal private method used to extract events from "virtual page" (DOM scrapping).
   * @param {Page} page - Representing puppeteer page instance.
   * @param {null|number} offset - Representing the number of events needed.
   * @returns {Promise<object>} - Representing events extract from events page.
   */
  _extractEvents (page, offset) {
    return page.evaluate((offset) => {
      let formatedEvents = []
      const visibleEvents = document.querySelectorAll('.tw-c-background.tw-elevation-1 .tw-mg-x-2')
      const selectedEvents = Array.from(visibleEvents).splice(0, offset || visibleEvents.length)
      const innerSelector = (target, selector) => target.querySelector(selector).innerText || null

      // TODO: Load more events. Need to simulate a virtual scrolldown.

      selectedEvents.forEach((selectedEvent) => {
        const [streamer, game] = innerSelector(selectedEvent, ':nth-child(3n)').split(/ streaming /)
        formatedEvents.push({
          link: selectedEvent.querySelector(':nth-child(1n)').href,
          title: innerSelector(selectedEvent, ':nth-child(1n) h4'),
          date: innerSelector(selectedEvent, ':nth-child(2n)'),
          game,
          streamer
        })
      })
      return formatedEvents
    }, offset)
  }

  /**
   * Internal private method used to extract description from linked event page (DOM scrapping).
   * @param {Page} page - Representing puppeteer page instance.
   * @returns {Promise<object>} Representing the event description.
   */
  _extractDescription (page) {
    return page.evaluate(() => {
      const description = document.querySelector('.events-landing-collection__main-col')
        ? document.querySelector('.events-landing-collection__main-col .tw-elevation-2 p span').innerText
        : document.querySelector('.simplebar-scroll-content .tw-flex-grow-1 p span').innerText
      return description || null
    })
  }
}

module.exports = TwitchEvent
