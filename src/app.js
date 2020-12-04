require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const recordRouter = require('./services/record-router')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knex = require('./knex')
const loginRouter = require('./services/login-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

  const store = new KnexSessionStore({
    knex
  });

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  app.use(
    session({
      secret: 'amorphouscthulucritter',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false,
        httpOnly: false
      },
      saveUninitialized: true,
      store,
    })
  );

app.use(morgan(morganOption))
app.use(helmet())


app.use(recordRouter)
app.use(loginRouter)

app.get('/', (req, res,) => {
  res.send('Hello, world!')
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    if (req.session.authenticated) {
      res.json(req.session)
    } else {
      if (password === 'somepassword') {
        req.session.authenticated = true
        req.session.user = {
          username, password
        }
        res.json(req.session)
      } else {
        res.status(403).json( { message: 'Bad Credentials' })
      }
    }
  }
  res.status(403).json( { message: 'Bad Credentials' })
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app