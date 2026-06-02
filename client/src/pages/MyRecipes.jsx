import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import RecipeCard from '../component/RecipeCard'

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    axios.get('http://localhost:3000/api/recipes/mine', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRecipes(res.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Recipes</h2>
        <Link to="/recipes/new" className="btn btn-success">+ Add Recipe</Link>
      </div>
      {recipes.length === 0 ? (
        <p className="text-muted">You haven't added any recipes yet.</p>
      ) : (
        <div className="row">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}

export default MyRecipes
