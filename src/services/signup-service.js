const SignupService = {
  insertNewUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => rows[0])
  }
}

module.exports = SignupService