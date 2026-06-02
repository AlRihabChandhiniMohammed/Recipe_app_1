import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const RecipeForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    title: '', description: '', ingredients: '', instructions: '',
    cookTime: '', difficulty: 'Medium', imageUrl: '', imageFile: null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:3000/api/recipes/${id}`)
        .then(res => {
          const r = res.data
          setForm({
            title: r.title,
            description: r.description || '',
            ingredients: JSON.parse(r.ingredients || '[]').join('\n'),
            instructions: JSON.parse(r.instructions || '[]').join('\n'),
            cookTime: r.cookTime || '',
            difficulty: r.difficulty || 'Medium',
            imageUrl: r.imageUrl || '',
            imageFile: null
          })
        })
        .catch(() => navigate('/'))
    }
  }, [id, isEdit, navigate])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = e => setForm({ ...form, imageFile: e.target.files[0] })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let imageUrl = form.imageUrl

      if (form.imageFile) {
        const fd = new FormData()
        fd.append('image', form.imageFile)
        const uploadRes = await axios.post('http://localhost:3000/api/upload', fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        })
        imageUrl = uploadRes.data.url
      }

      const payload = {
        title: form.title,
        description: form.description,
        ingredients: form.ingredients.split('\n').filter(Boolean),
        instructions: form.instructions.split('\n').filter(Boolean),
        cookTime: form.cookTime,
        difficulty: form.difficulty,
        imageUrl
      }

      if (isEdit) {
        await axios.put(`http://localhost:3000/api/recipes/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:3000/api/recipes', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      navigate('/recipes')
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h2>{isEdit ? 'Edit Recipe' : 'New Recipe'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title *</label>
          <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows="2" value={form.description} onChange={handleChange} />
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Cook Time</label>
            <input name="cookTime" className="form-control" placeholder="e.g. 30 mins" value={form.cookTime} onChange={handleChange} />
          </div>
          <div className="col">
            <label className="form-label">Difficulty</label>
            <select name="difficulty" className="form-select" value={form.difficulty} onChange={handleChange}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Ingredients * (one per line)</label>
          <textarea name="ingredients" className="form-control" rows="4" value={form.ingredients} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Instructions * (one step per line)</label>
          <textarea name="instructions" className="form-control" rows="5" value={form.instructions} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
          {form.imageUrl && !form.imageFile && (
            <p className="text-muted small mt-1">Current: {form.imageUrl}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update Recipe' : 'Create Recipe')}
        </button>
      </form>
    </div>
  )
}

export default RecipeForm
