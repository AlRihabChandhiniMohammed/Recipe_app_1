import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (onLogout) onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <Link className="navbar-brand" to="/">RECIPEDIA</Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/recipes">Recipes</Link></li>
            {isAuthenticated ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/my-recipes">My Recipes</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/recipes/new">+ Add</Link></li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link text-white" onClick={handleLogout} style={{ textDecoration: 'none' }}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
