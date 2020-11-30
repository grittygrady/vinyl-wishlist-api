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
  }
}

module.exports = RecordService