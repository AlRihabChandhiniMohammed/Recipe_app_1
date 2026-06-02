const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const User = require('./Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB connected Successfully...'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send("<h2 style='color:blue;text-align:center'>Welcome to Recipe App API</h2>")
})

app.post('/register', async (req, res) => {
  const { Username, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ Username, email, password: hashPassword })
    await newUser.save()
    res.json({ message: 'User Registered Successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid Credentials' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' })
    res.json({ message: 'Login Successful', Username: user.Username, token })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Server is Running on port: ' + PORT)
})
