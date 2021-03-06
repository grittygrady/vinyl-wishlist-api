require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const recordRouter = require('./services/record-router')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session)
const knex = require('./knex')
const loginRouter = require('./services/login-router')
const signupRouter = require('./services/signup-router')
const config = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

  const store = new KnexSessionStore({
    knex
  })

  app.set('trust proxy', 1)

  const inDev = config.NODE_ENV === 'development'
  app.use(
    session({
      secret: 'amorphouscthulucritter',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: !inDev,
        httpOnly: inDev,
        sameSite: inDev ? 'lax' : 'none'
      },
      resave: true,
      saveUninitialized: false,
      store,
    })
  );

  app.use(cors({
    origin: inDev ? 'http://localhost:3000' : ['https://vinyl-wishlist.vercel.app', 'https://vinyl-wishlist.herokuapp.com'],
    credentials: true,
    preflightContinue: false
  }))


app.use(morgan(morganOption))
app.use(helmet())


app.use(recordRouter)
app.use(signupRouter)
app.use(loginRouter)

app.get('/', (req, res,) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { message: error.message, error }
  }
  console.error(error)
  res.status(500).json(response)
})

module.exports = app