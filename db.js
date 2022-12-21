const { Pool } = require('pg')

const pool = new Pool({
  user: 'arnav',
  host: 'localhost',
  database: 'crime',
  password: 'password',
  port: 5432,
})

module.exports = { pool };