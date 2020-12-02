const app = require('./app')
const db = require('./knex')
const { PORT, DATABASE_URL } = require('./config')






app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})