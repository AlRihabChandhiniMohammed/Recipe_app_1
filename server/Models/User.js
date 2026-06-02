const db = require('../database')

const User = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null
  },

  create(data) {
    const stmt = db.prepare('INSERT INTO users (Username, email, password) VALUES (?, ?, ?)')
    const result = stmt.run(data.Username, data.email, data.password)
    return { id: result.lastInsertRowid, ...data }
  }
}

module.exports = User
