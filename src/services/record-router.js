const path = require('path')
const express = require('express')
const xss = require('xss')
const RecordService = require('./record-service')

const recordRouter = express.Router()
const jsonParser = express.json()

const sanitizeRecord = title => ({
  ...title,
  title: xss(title.title)
})

recordRouter
  .route('/recordslist')
  .get((req, res, next) => {
    RecordService.getAllRecords(req.app.get('db'))
      .then(records => {
        res.json(records.map(sanitizeRecord))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, title } = req.body
    const newRecord = { id, title }

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
  .route('/recordslist/:id')
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
  .delete((req, res, next) => {
    RecordService.deleteRecord(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = recordRouter