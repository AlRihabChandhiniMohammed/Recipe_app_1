const { db } = require('../firebase')

const collection = db.collection('users')

const User = {
  async findByEmail(email) {
    const snapshot = await collection.where('email', '==', email).get()
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  },

  async create(data) {
    const docRef = await collection.add(data)
    return { id: docRef.id, ...data }
  }
}

module.exports = User
