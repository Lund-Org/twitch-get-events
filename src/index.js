const utils = require('./utils.js')
const requests = require('./requests.js')
const { ModuleError } = require('./errors.js')
const {
  IS_DONE,
  IS_FAIL,
  USER_NOT_FOUND,
  ERROR_REQUEST,
  ERROR_PROCESS,
  ERROR_MESSAGE_DEFAULT,
  EVENTS_GLOBAL,
  EVENTS_PAST,
  TWITCH_HASH_EVENT,
  TWITCH_HASH_DESC
} = require('./constants.js')

/**
 * Class TwitchEvents.
 * @class TwitchEvents
 */
class TwitchEvents {
  /**
   * Static method to use as class builder alternative.
   * @param {string} clientId - The API twitch clientID.
   * @returns {TwitchEvents} New instance.
   */
  static init (clientId) {
    return new TwitchEvents(clientId)
  }

  /**
   * Class constructor.
   * @param {string} clientId - The API twitch clientID.
   * @throws {TypeError} Invalid client ID
   */
  constructor (clientId) {
    if (typeof clientId !== 'string') {
      throw new TypeError('The "clientId" argument must be type string.')
    }
    this.clientId = clientId
  }

  /**
   * Get coming events from twitch for an user.
   * @param {string} username - The twitch username.
   * @param {boolean} [hasDescription=false] - The event description extraction state.
   * @returns {object}
   */
  getNextEvents (username, hasDescription = false) {
    return this._getEvents(username, EVENTS_GLOBAL, hasDescription, 100)
  }

  /**
   * Get coming events from twitch for an user.
   * @description Alias of _getNextEvents()
   * @param {string} username - The twitch username.
   * @param {boolean} [hasDescription=false] - The event description extraction state.
   * @returns {object}
   */
  getGlobalEvents (username, hasDescription = false) {
    console.warn(
      'DeprecationWarning: The method "getGlobalEvents" is depreciated, use "getNextEvents" instead.'
    )
    return this._getEvents(username, EVENTS_GLOBAL, hasDescription, 100)
  }

  /**
   * Get past events from twitch for an user.
   * @param {string} username - The twitch username.
   * @param {boolean} [hasDescription=false] - The event description extraction state.
   * @param {null|number} [offset=20] - The number of events needed.
   * @returns {object}
   */
  getPastEvents (username, hasDescription = false, offset = 20) {
    return this._getEvents(username, EVENTS_PAST, hasDescription, offset)
  }

  /**
   * Get twitch events.
   * @async
   * @private
   * @param {string} username - The twitch username.
   * @param {string} type - The events type, can be "past" or "global".
   * @param {number} offset - The number of events needed.
   * @param {boolean} hasDescription - The event description extraction state.
   * @returns {Array} The events list.
   */
  async _getEvents (username, type, hasDescription, offset) {
    offset = Number(offset)
    const requestOptions = this._makeRequestOptions()
    const offsets = utils.prepareArrayWithOffset(offset, 100)
    const events = []

    for (const eventCount of offsets) {
      const startAt = events.length ? events[events.length - 1].startAt : null
      const requestData = this._makeRequestEventData(username, type, eventCount, startAt)
      const requestResponse = await this._post(requestOptions, requestData)
      const requestParsed = this._handleResponse(requestResponse)

      if (!('events' in requestParsed)) {
        return requestParsed
      }

      events.push(...requestParsed.events)
    }

    if (hasDescription) {
      await this._getEventsDescriptions(events, requestOptions)
    }

    return {
      state: IS_DONE,
      events: events
    }
  }

  /**
   * Retreive the descriptions of events.
   * @async
   * @private
   * @param {Array<object>} events - A list of events.
   * @param {object} requestOptions A request options.
   * @returns {Array<object>}
   */
  async _getEventsDescriptions (events, requestOptions) {
    const requestData = events.map((event) => {
      return this._makeRequestDescriptionData(event.id)
    })

    const descriptions = await this._post(requestOptions, requestData)

    for (const description of descriptions) {
      const index = events.findIndex((event) => {
        return description.data.event.id === event.id
      })

      Object.assign(events[index], {
        description: description.data.event.description
      })
    }

    return descriptions
  }

  /**
   * Post request with handled errors as code REQUEST_ERROR.
   * @async
   * @private
   * @param {object} options - Request options.
   * @param {object} data - Request data.
   * @returns {object|string} Request response.
   * @throws {ModuleError}
   */
  async _post (options, data) {
    try {
      const response = await requests.post(options, data)
      return response
    } catch (err) {
      throw new ModuleError(ERROR_MESSAGE_DEFAULT, ERROR_REQUEST, err)
    }
  }

  /**
   * Private method to build an option object to pass to the request (post).
   * @private
   * @returns {object} The request options object.
   */
  _makeRequestOptions () {
    return {
      protocol: 'https:',
      method: 'POST',
      hostname: 'gql.twitch.tv',
      path: '/gql',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Client-ID': this.clientId
      }
    }
  }

  /**
   * Make a https post request event data.
   * @private
   * @param {string} username - The twitch username.
   * @param {string} type - Event type, 'past' or 'global'.
   * @param {number} offset - Number of events needed.
   * @param {null|date} date - The date limit.
   * @returns {object} The builded data object.
   */
  _makeRequestEventData (username, type, offset, date) {
    const now = date || new Date()

    return [{
      operationName: 'EventsPage_EventScheduleQuery',
      variables: {
        channelLogin: username,
        limit: offset,
        before: type === EVENTS_PAST ? now : null,
        after: type === EVENTS_GLOBAL ? now : null,
        sortOrder: 'DESC',
        following: true
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: TWITCH_HASH_EVENT
        }
      }
    }]
  }

  /**
   * Make a https post request description data.
   * @private
   * @param {string} eventId - The event id.
   * @returns {object} The builded data object.
   */
  _makeRequestDescriptionData (eventId) {
    return {
      operationName: 'EventLandingPage_Event',
      variables: {
        eventName: eventId
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: TWITCH_HASH_DESC
        }
      }
    }
  }

  /**
   * Method to handle post request response.
   * @private
   * @param {object} requestResponse - The request response.
   * @returns {Promise}
   */
  _handleResponse (requestResponse) {
    if (requestResponse.errors && requestResponse.errors.length) {
      throw new ModuleError(
        ERROR_MESSAGE_DEFAULT,
        ERROR_PROCESS,
        requestResponse.errors
      )
    }

    if (!requestResponse.length) {
      return { events: [] }
    }

    const user = requestResponse.shift().data.user

    if (!user.id) {
      return {
        state: IS_FAIL,
        code: USER_NOT_FOUND
      }
    }

    return { events: this._formatEvents(user.eventLeaves.edges) }
  }

  /**
   * Method to format request response as events list.
   * @private
   * @param {Array<object>} events - The fetched events.
   * @returns {Array<object>} The formatted events list.
   */
  _formatEvents (events) {
    return events.map((event) => {
      return {
        id: event.node.id,
        title: event.node.title,
        game: event.node.game.displayName,
        streamer: event.node.channel.displayName,
        startAt: new Date(event.node.startAt),
        endAt: new Date(event.node.endAt)
      }
    })
  }
}

module.exports = TwitchEvents
