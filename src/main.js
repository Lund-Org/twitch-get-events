/**
 * Class TwitchEvent.
 * @class TwitchEvent
 */
class TwitchEvent {
  /**
   * Class constructor.
   * @param {string} username - The twitch username.
   */
  constructor(username) {
    if (typeof username !== 'string') {
      throw new Error('Error while trying to instanciate TwitchEvent class, "username" parameter should be string.')
    }
    this.username = username
  }
}

module.exports = TwitchEvent
