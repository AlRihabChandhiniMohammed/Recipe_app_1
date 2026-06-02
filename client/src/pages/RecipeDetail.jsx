import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  const ingredients = recipe ? (typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients) : []
  const instructions = recipe ? (typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions) : []

  useEffect(() => {
    axios.get(`http://localhost:3000/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/recipes')
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>
  if (!recipe) return null

  const isOwner = localStorage.getItem('token')

  return (
    <div className="container mt-4">
      <Link to="/recipes" className="btn btn-outline-secondary btn-sm mb-3">&larr; Back</Link>
      <div className="card shadow-sm">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl.startsWith('http') ? recipe.imageUrl : `http://localhost:3000${recipe.imageUrl}`}
            className="card-img-top"
            alt={recipe.title}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body">
          <h2>{recipe.title}</h2>
          <p className="text-muted">By {recipe.Username}</p>
          <div className="mb-3">
            <span className="badge bg-primary me-2">{recipe.difficulty}</span>
            {recipe.cookTime && <span className="badge bg-secondary">{recipe.cookTime}</span>}
          </div>
          {recipe.description && <p>{recipe.description}</p>}

          <h5>Ingredients</h5>
          <ul className="list-group mb-3">
            {ingredients.map((item, i) => (
              <li key={i} className="list-group-item">{item}</li>
            ))}
          </ul>

          <h5>Instructions</h5>
          <ol className="list-group list-group-numbered mb-3">
            {instructions.map((step, i) => (
              <li key={i} className="list-group-item">{step}</li>
            ))}
          </ol>

          {isOwner && (
            <div className="d-flex gap-2">
              <Link to={`/recipes/${id}/edit`} className="btn btn-warning">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
