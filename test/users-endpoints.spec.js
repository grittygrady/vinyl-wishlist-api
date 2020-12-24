const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')

describe(`Users endpoints`, function() {
  let db

  before(`make knex instance`, () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after(`disconnect from db`, () => db.destroy())

  before(`clean up the users table`, () => db('users').delete())

  before(`clean up the records table`, () => db('records').truncate())

  afterEach (`cleanup`, async () => {
    await db('users').delete()
    db('records').truncate()
  })

  describe(`POST /api/user`, () => {
    it(`Creates a new user on signup`, () => {
      const newUser = {
        username: 'testUser',
        email: 'test@testing.com',
        password: 'qwerasdf',
        confirm_password: 'qwerasdf'
      }
      return supertest(app)
        .post('/api/user')
        .send(newUser)
        .expect(res => {
          expect(res.status).to.eql(200)
        })
    })
  })
})