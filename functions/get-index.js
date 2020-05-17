const fs = require("fs")
const Mustache = require('mustache')
const aws4 = require('aws4')
const http = require('superagent-promise')(require('superagent'), Promise)
const URL = require('url')

const restaurantsApiRoot = process.env.restaurants_api
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let html

function loadHtml () {
  if (!html) {
    console.log('loading index.html...')
    html = fs.readFileSync('static/index.html', 'utf-8')
    console.log('loaded')
  }

  return html
}

const getRestaurants = async () => {
  const url = URL.parse(restaurantsApiRoot)
  const opts = {
    host: url.hostname,
    path: url.pathname
  }
  aws4.sign(opts)

  return (
    await http.get(restaurantsApiRoot)
      .set('Host', opts.headers['Host'])
      .set('X-Amz-Date', opts.headers['X-Amz-Date'])
      .set('Authorization', opts.headers['Authorization'])
      .set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token'])
  ).body
}

module.exports.handler = async () => {
  const template = loadHtml()
  const restaurants = await getRestaurants()
  const dayOfWeek = days[new Date().getDay()]
  const html = Mustache.render(template, { dayOfWeek, restaurants })
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    },
    body: html
  }
}
