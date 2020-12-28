const Knex = require('knex')
const { DATABASE_URL } = require('./config')

const db = Knex({
  client: 'pg',
  connection: DATABASE_URL
})

module.exports = db