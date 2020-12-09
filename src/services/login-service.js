const LoginService = {
  getUser(knex, username) {
    return knex
      .from('users')
      .select('*')
      .where({ username })
      .first()
  }
}

module.exports = LoginService