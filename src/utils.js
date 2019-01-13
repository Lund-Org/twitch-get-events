function prepareArrayWithOffset (offset, standard) {
  return Array(Math.floor(offset / standard))
    .fill(standard)
    .concat(offset > standard ? [offset % standard] : [offset])
}

module.exports = {
  prepareArrayWithOffset
}
