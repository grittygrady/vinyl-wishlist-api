const express = require('express')
const xss = require('xss')

const loginRouter = express.Router()
const jsonParser = express.json()

const sanitizeUser = user => ({
  email: xss(user.username),
  password: xss(user.password)
})

loginRouter
  .route('/api/login')
  .post(jsonParser, (req, res, next) => {
    console.log('HELLO LOGIN')
    res.status(201).send(JSON.stringify(req.body) + 'Post hit!')
  })

module.exports = loginRouter