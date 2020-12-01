const RecordService = {
  getAllRecords(knex) {
    return knex
      .select('*')
      .from('records')
  },
  insertRecord(knex, newRecord) {
    return knex
      .insert(newRecord)
      .into('records')
      .returning('*')
      .then(rows => rows[0])
  },
  getById(knex, id) {
    return knex
      .from('records')
      .select('*')
      .where({ id })
      .first()
  },
  deleteRecord(knex, id) {
    return knex
      .from('records')
      .where({ id })
      .delete()
  },
  updateRecord(knex, id, updatedRecord) {
    return knex
      .from('records')
      .where({ id })
      .update(updatedRecord, ['id', 'title'])
      .then(rows => rows[0])
  }
}

module.exports = RecordService