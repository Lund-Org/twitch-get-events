/**
 * Class ModuleError.
 * @extends {Error}
 */
class ModuleError extends Error {
  /**
   * Class constructor.
   * @param {Error|string} err Error or message.
   * @param {undefined|string} code - Error code.
   * @param {undefined|object} details - Error details.
   */
  constructor (err, code, details) {
    if (err instanceof Error) {
      super(err.message)
      this.stack = err.stack
    } else {
      super(err)
      Error.captureStackTrace(this)
    }

    this.code = code || this.constructor.name

    if (details) {
      this.details = details
    }
  }
}

module.exports = {
  ModuleError
}
