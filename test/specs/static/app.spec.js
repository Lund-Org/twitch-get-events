/* global describe it */
const path = require('path')
const expect = require('chai').expect

describe(`Demo test to avoid false positive`, function () {
  this.timeout(5000)
  it(`Test if the server can be launch without error`, function (done) {
    // Require the file to launch the server
    const app = require(path.join(__dirname, '/../../../static/app.js'))
    let isChecked = false

    app.setCallbackOnStart(() => {
      expect(app.isServerRunning()).to.be.equal(true)
      isChecked = true
      app.getServer().stop()
      done()
    })

    setTimeout(() => {
      // If in 5s the variable isChecked has not changed, we consider the server has not start quick enough
      if (!isChecked) {
        expect(false).to.be.equal(true) // to throw an error
        done()
      }
    }, 5000)
  })
})
