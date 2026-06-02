import React from 'react'
import { Link } from 'react-router-dom'

const RecipeCard = ({ recipe }) => {
  const ingredients = typeof recipe.ingredients === 'string'
    ? JSON.parse(recipe.ingredients || '[]')
    : (recipe.ingredients || [])

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl.startsWith('http') ? recipe.imageUrl : `http://localhost:3000${recipe.imageUrl}`}
            className="card-img-top"
            alt={recipe.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{recipe.title}</h5>
          <p className="card-text text-muted small">{recipe.description}</p>
          <div className="mb-2">
            <span className="badge bg-primary me-1">{recipe.difficulty}</span>
            {recipe.cookTime && <span className="badge bg-secondary">{recipe.cookTime}</span>}
          </div>
          <p className="card-text small">
            <strong>Ingredients:</strong> {ingredients.slice(0, 3).join(', ')}
            {ingredients.length > 3 && ' ...'}
          </p>
          <div className="mt-auto">
            <Link to={`/recipes/${recipe.id}`} className="btn btn-outline-primary btn-sm w-100">View Recipe</Link>
          </div>
        </div>
        <div className="card-footer text-muted small">
          By {recipe.Username}
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
