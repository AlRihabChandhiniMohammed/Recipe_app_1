const express = require('express')
const router = express.Router()
const Recipe = require('../Models/Recipe')
const auth = require('../middleware/auth')

router.get('/', (req, res) => {
  try {
    const recipes = Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/mine', auth, (req, res) => {
  try {
    const recipes = Recipe.findByUser(req.userId)
    res.json(recipes)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const recipe = Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
    res.json(recipe)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', auth, (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookTime, difficulty, imageUrl } = req.body
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Title, ingredients, and instructions are required' })
    }
    const recipe = Recipe.create({
      title, description,
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
      cookTime, difficulty, imageUrl,
      userId: req.userId
    })
    res.status(201).json(recipe)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:id', auth, (req, res) => {
  try {
    const existing = Recipe.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Recipe not found' })
    if (existing.userId !== req.userId) return res.status(403).json({ message: 'Not authorized' })

    const data = { ...req.body }
    if (data.ingredients && Array.isArray(data.ingredients)) {
      data.ingredients = JSON.stringify(data.ingredients)
    }
    if (data.instructions && Array.isArray(data.instructions)) {
      data.instructions = JSON.stringify(data.instructions)
    }
    const recipe = Recipe.update(req.params.id, data)
    res.json(recipe)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth, (req, res) => {
  try {
    const existing = Recipe.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Recipe not found' })
    if (existing.userId !== req.userId) return res.status(403).json({ message: 'Not authorized' })
    Recipe.delete(req.params.id)
    res.json({ message: 'Recipe deleted' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
