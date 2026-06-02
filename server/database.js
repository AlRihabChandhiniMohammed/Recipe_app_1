const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'data.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`)

module.exports = db
