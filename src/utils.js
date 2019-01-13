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

module.exports = {
  prepareArrayWithOffset
}
