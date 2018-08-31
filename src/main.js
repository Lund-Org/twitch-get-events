const https = require('https')

// Privates symbols declaration.
const _getEvents = Symbol('getEvents')
const _buildOptions = Symbol('buildOptions')
const _buildEventData = Symbol('buildEventData')
const _buildDescriptionData = Symbol('buildDescriptionData')
const _post = Symbol('post')
const _handleResponse = Symbol('handleResponse')
const _formatResponseAsEvents = Symbol('formatResponseAsEvents')

/**
 * Class TwitchEvent.
 * @class TwitchEvent
 */
class TwitchEvent {
  /**
   * Class constructor.
   * @param {string} clientId - The API twitch clientID.
   * @param {string} username - The twitch username.
   */
  constructor (clientId, username) {
    if (typeof clientId !== 'string') {
      throw new Error('Error while trying to instanciate TwitchEvent class, "clientId" parameter should be string.')
    }
    if (typeof username !== 'string') {
      throw new Error('Error while trying to instanciate TwitchEvent class, "username" parameter should be string.')
    }
    this.clientId = clientId
    this.username = username
  }

  /**
   * Method used to extract globals events from twitch user.
   * @param {boolean} [hasDescription=false] - The event description extraction state.
   * @returns {Array} The globals events list.
   */
  getGlobalEvents (hasDescription = false) {
    return this[_getEvents]('global', 100, hasDescription)
  }

  /**
   * Method used to extract past events from twitch user.
   * @param {null|number} [offset=null] - The number of events needed.
   * @param {boolean} [hasDescription=false] - The event description extraction state.
   * @returns {Array} The past events list.
   */
  getPastEvents (offset = null, hasDescription = false) {
    return this[_getEvents]('past', offset, hasDescription)
  }

  /**
   * Internal private method used to get needed events.
   * @private
   * @param {string} type - The events type, can be "past" or "global".
   * @param {null|number} offset - The number of events needed.
   * @param {boolean} hasDescription - The event description extraction state.
   * @returns {Array} The events list.
   */
  async [_getEvents] (type, offset, hasDescription) {
    try {
      offset = offset || 20

      const limit = 100
      const options = this[_buildOptions]()
      let list = []
      let count = Number(offset)

      let iterator
      let eventData
      let requestResponse
      let formatted

      do {
        // Work with iterator to select adjusted amount of events by request.
        iterator = offset > limit ? limit : offset
        iterator = iterator > count ? count : iterator
        count = count - iterator

        eventData = this[_buildEventData](
          type,
          iterator,
          list.length > 0 ? list[list.length - 1].startAt : null
        )

        requestResponse = await this[_post](options, eventData)
        formatted = await this[_handleResponse](requestResponse)

        if (typeof formatted === 'undefined') {
          return {
            status: 'success',
            message: 'No user found!',
            data: null
          }
        }

        list = list.concat(formatted)
      } while (count !== 0)

      // If we need event description, we need to send a second request.
      if (hasDescription) {
        let eventIndex
        let descriptionData = []

        list.forEach((event) => descriptionData.push(this[_buildDescriptionData](event.id)))
        const descriptions = await this[_post](options, descriptionData)

        for (let i = 0; i < descriptions.length; ++i) {
          eventIndex = list.findIndex((event) => descriptions[i].data.event.id === event.id)
          list[eventIndex].description = descriptions[i].data.event.description
        }
      }

      return {
        status: 'success',
        data: list
      }
    } catch (err) {
      if (err.constructor.name === 'IncomingMessage') {
        console.error('You probably use an invalid client-id. Please check it.')
      } else {
        console.error(err)
      }

      return {
        status: 'error',
        errors: err
      }
    }
  }

  /**
   * Private method to build an option object to pass to the request (post).
   * @private
   * @returns {object} The builded options object.
   */
  [_buildOptions] () {
    return {
      protocol: 'https:',
      method: 'POST',
      hostname: 'gql.twitch.tv',
      path: '/gql',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'client-id': this.clientId
      }
    }
  }

  /**
   * Private method to build an data object to pass to the request (post).
   * @private
   * @param {string} type - Event type, "past" or "global".
   * @param {number} offset - Number of events needed.
   * @param {null|date} [date=null] - The events date limit.
   * @returns {object} The builded data object.
   */
  [_buildEventData] (type, offset, date = null) {
    const now = date || new Date()

    return [{
      'operationName': 'EventsPage_EventScheduleQuery',
      'variables': {
        'channelLogin': this.username,
        'limit': typeof offset === 'string' ? parseInt(offset) : offset,
        'before': type === 'past' ? now : null,
        'after': type === 'global' ? now : null,
        'sortOrder': 'DESC',
        'following': true
      },
      'extensions': {
        'persistedQuery': {
          'version': 1,
          'sha256Hash': '1ddc422675ea9d6e7659d54923633fede3a804bfec3b20e3df6ef8eea40d3ea1'
        }
      }
    }]
  }

  [_buildDescriptionData] (eventId) {
    return {
      'operationName': 'EventLandingPage_Event',
      'variables': {
        'eventName': eventId
      },
      'extensions': {
        'persistedQuery': {
          'version': 1,
          'sha256Hash': '4fdc0f4f963f4b9ca046a0638dd5f96643708f49e129d437e48efb8d521cbaa4'
        }
      }
    }
  }

  /**
   * Private method to exec https.post request.
   * @private
   * @param {object} options - The request options.
   * @param {object} data - The request post data.
   * @returns {Promise} The request response.
   */
  [_post] (options, data) {
    return new Promise((resolve, reject) => {
      const request = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          reject(res)
          return
        }

        res.setEncoding('utf8')

        let result = ''

        res.on('data', (chunk) => {
          result += chunk
        })

        res.on('end', () => {
          resolve(JSON.parse(result))
        })
      })

      request.on('error', (err) => {
        reject(err)
      })

      request.write(JSON.stringify(data))
      request.end()
    })
  }

  /**
   * Private method to handle post request response.
   * @private
   * @param {object} requestResponse - The request response.
   * @returns {Promise} If resolved, formatted events response, else request error.
   */
  [_handleResponse] (requestResponse) {
    return new Promise((resolve, reject) => {
      if (requestResponse.errors && Object.bind.keys(requestResponse.errors).length > 0) {
        reject(requestResponse)
      } else {
        resolve(this[_formatResponseAsEvents](requestResponse))
      }
    })
  }

  /**
   * Private method to format request response.
   * @private
   * @param {Array} response - The request response.
   * @returns {undefined, Array.<object>} The formatted events list.
   */
  [_formatResponseAsEvents] (response) {
    const formatted = []
    const user = response[0].data.user

    if (!user.id) {
      return undefined
    }

    user.eventLeaves.edges.forEach((event) => {
      event = event.node

      formatted.push({
        id: event.id,
        title: event.title,
        game: event.game.displayName,
        streamer: event.channel.displayName,
        startAt: new Date(event.startAt),
        endAt: new Date(event.endAt)
      })
    })

    return formatted
  }
}

module.exports = TwitchEvent
