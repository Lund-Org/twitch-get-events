module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'standard', 'promise'
  ],
  env: {
    node: true,
    mocha: true
  },
  globals: {
    __root: true,
    path: true,
    assert: true,
    expect: true,
    should: true
  }
}
