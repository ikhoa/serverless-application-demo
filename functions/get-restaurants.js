// Dependencies
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
/**
 * Default
 * @type {string | number}
 */
const defaultResults = process.env.defaultResults|| 8
const tableName = process.env.restaurants_table

const getRestaurants = async (count) => {
  const req = {
    TableName: tableName,
    Limit: count
  }
  const resp = await dynamoDB.scan(req).promise()
  return resp.Items
}

module.exports.handler = async (event, context) => {
  const restaurants = await getRestaurants(defaultResults)
  return {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }
}
