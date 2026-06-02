const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const User = require('./Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const recipeRoutes = require('./routes/recipes')
const uploadRoutes = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.send("<h2 style='color:blue;text-align:center'>Welcome to Recipe App API</h2>")
})

app.post('/register', async (req, res) => {
  const { Username, email, password } = req.body
  try {
    const existingUser = User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    User.create({ Username, email, password: hashPassword })
    res.json({ message: 'User Registered Successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = User.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid Credentials' })
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' })
    res.json({ message: 'Login Successful', Username: user.Username, token })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.use('/api/recipes', recipeRoutes)
app.use('/api/upload', uploadRoutes)

app.listen(PORT, () => {
  console.log('Server is Running on port: ' + PORT)
})
