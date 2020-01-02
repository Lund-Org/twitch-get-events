const path = require('path')
const { assert, expect, should } = require('chai')
const fs = require('fs')

if (!process.env.CI) {
  try {
    fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8')
      .split('\n')
      .map((line) => line.split('='))
      .filter((contents) => (
        Array.isArray(contents) && contents.length > 1
      ))
      .forEach(([name, value]) => {
        Object.assign(process.env, {
          [name.trim()]: value.trim() 
        })
      })
  } catch (err) {
    console.error('Can not load .env file.')
  }
}

process.env.NODE_ENV = 'test'
global.__root = path.resolve(__dirname, '../')
global.path = path
global.assert = assert
global.expect = expect
global.should = should

