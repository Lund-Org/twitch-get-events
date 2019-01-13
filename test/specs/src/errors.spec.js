/* eslint no-unused-expressions: 0 */

const path = require('path')
const errors = require(path.resolve(__root, './src/errors.js'))

const ERR_MESSAGE = 'ERR_MESSAGE'
const ERR_CODE = 'ERR_CODE'
const ERR_DETAILS = { state: true, events: { } }
const ERR_INSTANCE = new Error(ERR_MESSAGE)

describe('class ModuleError', () => {
  const ModuleError = errors.ModuleError

  it('work fine when first argument is an Error', () => {
    const err = new ModuleError(ERR_INSTANCE, ERR_CODE, ERR_DETAILS)
    expect(err).to.have.property('message', ERR_MESSAGE)
    expect(err).to.have.property('code', ERR_CODE)
    expect(err).to.have.property('details', ERR_DETAILS)
    expect(err).to.have.property('stack').to.not.be.empty
  })

  it('work fine when the first argument is a string', () => {
    const err = new ModuleError(ERR_MESSAGE, ERR_CODE, ERR_DETAILS)
    expect(err).to.have.property('message', ERR_MESSAGE)
    expect(err).to.have.property('code', ERR_CODE)
    expect(err).to.have.property('details', ERR_DETAILS)
    expect(err).to.have.property('stack').to.not.be.empty
  })

  it('work fine without details', () => {
    const err = new ModuleError(ERR_MESSAGE, ERR_CODE)
    expect(err).to.have.property('message', ERR_MESSAGE)
    expect(err).to.have.property('code', ERR_CODE)
    expect(err).to.not.have.property('details')
    expect(err).to.have.property('stack').to.not.be.empty
  })

  it('work fine without code', () => {
    const err = new ModuleError(ERR_MESSAGE, null, ERR_DETAILS)
    expect(err).to.have.property('message', ERR_MESSAGE)
    expect(err).to.have.property('code', err.constructor.name)
    expect(err).to.have.property('details', ERR_DETAILS)
    expect(err).to.have.property('stack').to.not.be.empty
  })
})
