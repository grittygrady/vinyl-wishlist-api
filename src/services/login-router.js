const express = require('express')
const xss = require('xss')
const bcrypt = require('bcrypt')
const LoginService = require('./login-service')

const loginRouter = express.Router()
const jsonParser = express.json()

const sanitizeUser = user => ({
  email: xss(user.username),
  password: xss(user.password)
})

loginRouter
  .route('/api/login')
  .get(jsonParser, (req, res, next) => {
    bcrypt.compareSync(req.params.password, users.password)
    // SELECT REQ.PARAMS.USERNAME WHERE USERS.USERNAME === BOB
    // ERROR MSG IN EVENT OF A 403 IF !USER REDIR TO LOGIN OR REGISTRATION
    // ELSE 
    // BCRYPT.COMPARESYNCH(UNHASHED REQ.PARAMS.PASSWORD, USER.PASSWORD)
    // IF ELSE LOGIN OR REGISTER REDIRECT
    // IF SUCCESFUL req.session.user = user
    // CONTINUE RES => ETC RES SEND
    console.log('HELLO LOGIN')
    res.status(201).send(JSON.stringify(req.body) + 'Post hit!')
  })
  

module.exports = loginRouter