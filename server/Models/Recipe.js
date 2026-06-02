const db = require('../database')

const Recipe = {
  findAll() {
    return db.prepare(`
      SELECT recipes.*, users.Username FROM recipes
      JOIN users ON recipes.userId = users.id
      ORDER BY recipes.createdAt DESC
    `).all()
  },

  findById(id) {
    return db.prepare(`
      SELECT recipes.*, users.Username FROM recipes
      JOIN users ON recipes.userId = users.id
      WHERE recipes.id = ?
    `).get(id) || null
  },

  findByUser(userId) {
    return db.prepare(`
      SELECT * FROM recipes WHERE userId = ? ORDER BY createdAt DESC
    `).all(userId)
  },

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO recipes (title, description, ingredients, instructions, cookTime, difficulty, imageUrl, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.title, data.description, data.ingredients, data.instructions,
      data.cookTime || null, data.difficulty || 'Medium', data.imageUrl || null, data.userId
    )
    return this.findById(result.lastInsertRowid)
  },

  update(id, data) {
    const fields = []
    const values = []
    for (const [key, value] of Object.entries(data)) {
      if (['title', 'description', 'ingredients', 'instructions', 'cookTime', 'difficulty', 'imageUrl'].includes(key)) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    }
    if (fields.length === 0) return this.findById(id)
    fields.push("updatedAt = datetime('now')")
    values.push(id)
    db.prepare(`UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return this.findById(id)
  },

  delete(id) {
    const recipe = this.findById(id)
    if (recipe) {
      db.prepare('DELETE FROM recipes WHERE id = ?').run(id)
    }
    return recipe
  }
}

module.exports = Recipe
