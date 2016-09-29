#!/usr/bin/env node

const args = process.argv.slice(2)
if (args.length < 3) {
  console.log('Usage: ./hack.js <Cookie on https://app.myimaths.com> <Url of the question page> <Desired score for question #1> <for question #2>...')
  process.exit(1)
}
const scores = args.slice(2).map(score => {
  let num = parseInt(score)
  if (num < 0) {
    console.log('Score must be >= 0; At score ' + score)
    process.exit(2)
    return null
  }
  if (!Number.isSafeInteger(num)) {
    console.log('Score must be a integer that make sense; At score ' + score)
    process.exit(2)
    return null
  }
  return num
})

const request = require('request')
const qs = require('querystring')

const metaHeader = {
  'Accept': 'text/html,application/xhtml+xml,application/xml',
  'Accept-Language': 'en,zh;q=0.8',
  'Origin': 'https://app.myimaths.com',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)',
    // Simplifying this more results in browser upgrade redirect.
  'Cookie': args[0],
  'Referer': args[1],
}

let postObj = {
  testID: 2004, // Changing this don't seems to do anything, but the server requires it.
}

for (let q = 0; q < scores.length; q ++) {
  let qno = q + 1
  postObj[`q${qno}score`] = scores[q]
}

request({
  url: 'https://app.myimaths.com/studentRecords/OHsavescores.asp',
  method: 'post',
  headers: metaHeader,
  followRedirect: false,
  body: qs.stringify(postObj)
}, (err, icm, res) => {
  if (err) {
    console.error(err)
    console.log('Sorry, something goes wrong.')
    process.exit(3)
    return
  }
  if (icm.statusCode !== 200) {
    console.log("Sorry, This don't work anymore. Fire a GitHub issue now!")
    process.exit(3)
    return
  }
  console.log('Success! Check out your results page.')
  process.exit(0)
})
