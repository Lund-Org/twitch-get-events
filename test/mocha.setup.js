const path = require('path')
const { assert, expect, should } = require('chai')
const fs = require('fs')

if (!process.env.CI) {
  try {
    fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8')
      .split('\n')
      .map((line) => line.split('='))
      .forEach(([name, value]) => Object.assign(process.env, {
        [name.trim()]: value.trim()
      }))
  } catch (err) {
    console.error('Can not load .env file.')
  }
}

console.log({ name: process.env.TWITCH_USERNAME })

process.env.NODE_ENV = 'test'
global.__root = path.resolve(__dirname, '../')
global.path = path
global.assert = assert
global.expect = expect
global.should = should

