import React, { useState, useEffect } from 'react'
import axios from 'axios'
import RecipeCard from '../component/RecipeCard'

const RecipeList = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3000/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-muted">No recipes yet. Be the first to add one!</p>
      ) : (
        <div className="row">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}

export default RecipeList
