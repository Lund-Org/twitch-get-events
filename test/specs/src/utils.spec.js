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

describe('hasIntegerFormat()', () => {
  const hasIntegerFormat = utils.hasIntegerFormat

  it('work fine and return false when "value" is an integer or a string integer', () => {
    expect(hasIntegerFormat([10])).to.equal(false)
    expect(hasIntegerFormat(undefined)).to.equal(false)
    expect(hasIntegerFormat('1100A')).to.equal(false)
    expect(hasIntegerFormat('HelloWorld110')).to.equal(false)
  })

  it('work fine and return true when "value" is an integer', () => {
    expect(hasIntegerFormat(10)).to.equal(true)
  })

  it('work fine and return true when "value" is a string integer', () => {
    expect(hasIntegerFormat('10')).to.equal(true)
  })
})
