function prepareArrayWithOffset (offset, standard) {
  return Array(Math.floor(offset / standard))
    .fill(standard)
    .concat(offset > 100 ? [offset % standard] : [])
}

module.exports = {
  prepareArrayWithOffset
}
