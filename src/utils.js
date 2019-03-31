/**
 * Prepare an Array with offsets.
 * @example
 *
 *    prepareArrayWithOffset(5, 10)   // => [5]
 *    prepareArrayWithOffset(25, 10)  // => [10, 10, 5]
 *
 * @param {number} offset - The offset to store.
 * @param {number} standard - The max by cell.
 */
function prepareArrayWithOffset (offset, standard) {
  const rest = offset % standard
  return Array(Math.floor(offset / standard))
    .fill(standard)
    .concat(rest !== 0 ? [rest] : [])
}

/**
 * Check if value is an integer or a string integer.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function hasIntegerFormat (value) {
  return typeof value === 'string'
    ? value.match(/^\d+$/g) !== null
    : Number.isInteger(value)
}

module.exports = {
  prepareArrayWithOffset,
  hasIntegerFormat
}
