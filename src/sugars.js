/**
 * Check if value is an Array.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isArray (value) {
  return Array.isArray(value)
}

/**
 * Check if it's a an object.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isObject (value) {
  return typeof value === 'object' && !isNull(value)
}

/**
 * Check if value is a string.
 * @param {any} - Tested value.
 * @returns {boolean}
 */
function isString (value) {
  return typeof value === 'string'
}

/**
 * Check if value is null.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isNull (value) {
  return value === null
}

module.exports = {
  isArray,
  isObject,
  isString,
  isNull
}
