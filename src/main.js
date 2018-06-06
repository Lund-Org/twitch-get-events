const puppeteer = require('puppeteer')

class TwitchEvent {
  async get () {
    let ret = ''
    try {
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      })
      const page = await browser.newPage()
      await page.goto('https://google.com', { waitUntil: 'networkidle2' })
      ret = await page.content()

      await browser.close()
    } catch (e) {
      console.log(e)
    }
    return ret
  }
}

module.exports = TwitchEvent
