const path = require('path')
const utils = require(path.resolve(__root, './src/utils.js'))

describe('prepareArrayWithOffset()', () => {
  const prepareArrayWithOffset = utils.prepareArrayWithOffset

  it('work fine when offset is lower than standard', () => {
    expect(prepareArrayWithOffset(5, 10)).to.deep.equal([5])
  })

  it('work fine when offset is greater than standard', () => {
    expect(prepareArrayWithOffset(15, 10)).to.deep.equal([10, 5])
  })

  it('work fine when offset is equal than standard', () => {
    expect(prepareArrayWithOffset(10, 10)).to.deep.equal([10])
  })
})
