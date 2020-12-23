const RecordService = {
  getAllRecords(knex, username) {
    return knex
      .select('*').from('records').join('users', {'records.owner_id': 'users.username'})
      // .join('users', {'records.owner_id': 'users.username'})
      // .select('*')
      .where('records.owner_id', 'like', username)
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
      .returning('id', 'title')
      .then(rows => rows[0])
  }
}

module.exports = RecordService