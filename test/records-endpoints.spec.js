const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeRecordsArray } = require('./records.fixtures')

describe(`Records endpoints`, function() {
  let db

  before(`make knex instance`, () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after(`disconnect from db`, () => db.destroy())

  before(`clean up the records table`, () => db('records').truncate())

  afterEach(`cleanup`, () => db('records').truncate())

  describe(`GET /recordslist`, () => {
    context(`given records in the database`, () => {
      const testRecords = makeRecordsArray()

      beforeEach(`insert records`, () => {
        return db
          .into('records')
          .insert(testRecords)
      })

      it(`responds with 200 and all of the records`, () => {
        return supertest(app)
          .get('/recordslist')
          .expect(200, testRecords)
      })
    })
  })
})