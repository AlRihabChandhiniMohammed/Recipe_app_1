const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

let users = []
let recipes = []
let nextUserId = 1
let nextRecipeId = 1

const auth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

app.post('/api/register', async (req, res) => {
  const { Username, email, password } = req.body
  try {
    const existing = users.find(u => u.email === email)
    if (existing) return res.status(400).json({ message: 'User already exists' })
    const hashPassword = await bcrypt.hash(password, 10)
    const user = { id: nextUserId++, Username, email, password: hashPassword, createdAt: new Date().toISOString() }
    users.push(user)
    res.json({ message: 'User Registered Successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = users.find(u => u.email === email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid Credentials' })
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'Login Successful', Username: user.Username, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/recipes', (req, res) => {
  const result = recipes.map(r => {
    const user = users.find(u => u.id === r.userId)
    return { ...r, Username: user ? user.Username : 'Unknown' }
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(result)
})

app.get('/api/recipes/mine', auth, (req, res) => {
  const result = recipes.filter(r => r.userId === req.userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(result)
})

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id))
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
  const user = users.find(u => u.id === recipe.userId)
  res.json({ ...recipe, Username: user ? user.Username : 'Unknown' })
})

app.post('/api/recipes', auth, (req, res) => {
  const { title, description, ingredients, instructions, cookTime, difficulty, imageUrl } = req.body
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Title, ingredients, and instructions are required' })
  }
  const recipe = {
    id: nextRecipeId++,
    title,
    description: description || '',
    ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients),
    instructions: typeof instructions === 'string' ? instructions : JSON.stringify(instructions),
    cookTime: cookTime || null,
    difficulty: difficulty || 'Medium',
    imageUrl: imageUrl || null,
    userId: req.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  recipes.push(recipe)
  const user = users.find(u => u.id === recipe.userId)
  res.status(201).json({ ...recipe, Username: user ? user.Username : 'Unknown' })
})

app.put('/api/recipes/:id', auth, (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ message: 'Recipe not found' })
  if (recipes[index].userId !== req.userId) return res.status(403).json({ message: 'Not authorized' })

  const data = req.body
  for (const key of ['title', 'description', 'ingredients', 'instructions', 'cookTime', 'difficulty', 'imageUrl']) {
    if (data[key] !== undefined) {
      if ((key === 'ingredients' || key === 'instructions') && Array.isArray(data[key])) {
        recipes[index][key] = JSON.stringify(data[key])
      } else {
        recipes[index][key] = data[key]
      }
    }
  }
  recipes[index].updatedAt = new Date().toISOString()

  const user = users.find(u => u.id === recipes[index].userId)
  res.json({ ...recipes[index], Username: user ? user.Username : 'Unknown' })
})

app.delete('/api/recipes/:id', auth, (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ message: 'Recipe not found' })
  if (recipes[index].userId !== req.userId) return res.status(403).json({ message: 'Not authorized' })
  recipes.splice(index, 1)
  res.json({ message: 'Recipe deleted' })
})

app.post('/api/upload', auth, (req, res) => {
  const { image } = req.body
  if (!image) return res.status(400).json({ message: 'No file uploaded' })
  const ext = image.split(';')[0].split('/')[1] || 'png'
  const filename = `${uuidv4()}.${ext}`
  res.json({ url: image, filename })
})

module.exports = app
