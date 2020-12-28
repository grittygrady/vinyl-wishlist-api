const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeRecordsArray } = require('./records.fixtures')
const session = require('supertest-session')


describe(`Records endpoints`, function() {
  let testSession = null

  beforeEach(function () {
    testSession = session(app)
  })

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

  describe(`GET api/recordslist`, () => {
    context(`given records in the database`, () => {
      const testRecords = makeRecordsArray()

      beforeEach(`insert records`, () => {
        return db
          .into('records')
          .insert(testRecords)
      })

      it(`Responds with a redirect if user is not logged in`, () => {
        return supertest(app)
          .get('/api/recordslist')
          .expect({ redirect: '/login' })
      })
    })
  })
  
  describe(`POST /api/recordlist`, () => {
    it(`Creates a new record entry, responds with 201 and the new record`, () => {
      const newRecord = {
        id: '123',
        title: 'Michael Jackson - Bad'
      }
      testSession.post('/api/recordslist')
        .send({ username: 'grit', password: 'qwerasdf' })
        .send(newRecord)
        .expect(res => {
          expect(res.body.id).to.eql(newRecord.id)
          expect(res.body.title).to.eql(newRecord.title)
        })
    })
  })
  describe(`DELETE /api/recordslist/:id`, () => {
    const testRecords = makeRecordsArray()

    beforeEach(`Insert records`, () => {
      return db
        .into('records')
        .insert(testRecords)
    })

    it(`Responds with 204 and removes the record`, () => {
      const idToRemove = '2'
      const expectedRecords = testRecords.filter(record => record.id !== idToRemove)
      testSession.delete(`/api/recordslist/${idToRemove}`)
        .send({ username: 'grit', password: 'qwerasdf' })
        .expect(204)
        .then(res => 
          supertest(app)
            .get(`/api/recordslist`)
            .expect(expectedRecords)  
        )
    })
  })

  describe(`PATCH /api/recordslist/:id`, () => {
    const testRecords = makeRecordsArray()

    beforeEach(`Insert records`, () => {
      return db
        .into('records')
        .insert(testRecords)
    })

    it(`Responds with 204 and updates the article`, () => {
      const idToUpdate = '2'
      const updatedRecord = {
        id: '2',
        title: 'Updated record title'
      }
      const expectedRecord = {
        ...testRecords[parseFloat(idToUpdate) - 1],
        ...updatedRecord
      }
      testSession.patch(`/api/recordslist/${idToUpdate}`)
        .send({ username: 'grit', password: 'qwerasdf' })
        .send(updatedRecord)
        .then(res => 
          supertest(app)
            .get(`/api/recordslist/${idToUpdate}`)
            .expect(expectedRecord)
        )
    })
  })
})