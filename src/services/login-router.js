const express = require('express')
const xss = require('xss')
const { route } = require('./record-router')

const recordRouter = express.Router()
const jsonParser = express.json()

recordRouter
  .route('/api/login')
  .post((req, res ) => {
    console.log('HELLO LOGIN')

  })

module.exports = loginRouter