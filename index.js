#!/usr/bin/env node

/*
  On line 19, replace the long string with your *cookie* on https://app.myimaths.com.
  On line 20, replace the URL with the URL of the question page.
  On line 30 and 31, replace the mark with the desired mark. It can't be greater
    than the question total mark or this won't work.
  Run this program. If it output 200 and some other stuff, than you're all good!
*/

const request = require('request')
const qs = require('querystring')

const metaHeader = {
  'Accept': 'text/html,application/xhtml+xml,application/xml',
  'Accept-Language': 'en,zh;q=0.8',
  'Origin': 'https://app.myimaths.com',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)',
  'Cookie': 'myimaths_session_id=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;',
  'Referer': 'https://app.myimaths.com/xxxx-xxxxxxxx/xxxxxx',
}

request({
  url: 'https://app.myimaths.com/studentRecords/OHsavescores.asp',
  method: 'post',
  headers: metaHeader,
  followRedirect: false,
  body: qs.stringify({
    testID: 2004,
    q1score: 10,
    q2score: 15,
  })
}, (err, icm, res) => {
  if (err) {
    console.error(err)
  }
  console.log(icm.statusCode)
  console.log(res)
  process.nextTick(() => {
    process.exit(icm.statusCode === 200 ? 0 : 1)
  })
})
