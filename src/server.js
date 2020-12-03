const app = require('./app')
const db = require('./knex')
const { PORT } = require('./config')


app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})