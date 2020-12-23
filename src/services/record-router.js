const express = require('express')
const xss = require('xss')
const RecordService = require('./record-service')
const cors =  require('cors')
const recordRouter = express.Router()
const jsonParser = express.json()

const sanitizeRecord = title => ({
  id: title.id,
  title: xss(title.title)
})

recordRouter
  .route('/api/recordslist')
  .get((req, res, next) => {
    if (!req.session.user) {
      return res.json({redirect: '/login'})
    }
    const username = req.session.user.username
    RecordService.getAllRecords(req.app.get('db'), username)
      .then(records => {
        res.json(records.map(sanitizeRecord))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    if (!req.session.user) {
      return res.json({redirect: '/login'})
    }
    
    const { id, title } = req.body
    const username = req.session.user.username
    const newRecord = { id, title, owner_id: username }

    if ( newRecord.title.length < 0 ) {
      return res.status(400).json({
        error: { message: 'Title is required'}
      })
    }

    RecordService.insertRecord(req.app.get('db'), newRecord)
      .then(record => {
        res.status(201)
          .json(sanitizeRecord(record))
      })
      .catch(next)
  })

recordRouter
  .route('/api/recordslist/:id')
  .all((req, res, next) => {
    RecordService.getById(req.app.get('db'), req.params.id)
      .then(record => {
        if (!record) {
          return res.status(404).json({
            error: { message: `Record doesn't exist`}
          })
        }
        res.record = record
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(sanitizeRecord(res.record))
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, id } = req.body
    const updatedRecord = { title, id }
    if (updatedRecord.title < 0) {
      return res.status(400).json({
        error: { message: `Title must be at least one character long` }
      })
    }
    RecordService.updateRecord(
      req.app.get('db'),
      req.params.id,
      updatedRecord
    )
      .then(updatedRecord => {
        console.log(updatedRecord, sanitizeRecord(updatedRecord))
        res.status(204).send(sanitizeRecord(updatedRecord))
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    RecordService.deleteRecord(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = recordRouter