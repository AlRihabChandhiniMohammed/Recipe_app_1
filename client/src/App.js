import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from "./component/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RecipeList from "./pages/RecipeList"
import RecipeDetail from "./pages/RecipeDetail"
import RecipeForm from "./pages/RecipeForm"
import MyRecipes from "./pages/MyRecipes"
import "./App.css"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))

  const handleLogin = () => setIsAuthenticated(true)
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('Username')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/new" element={isAuthenticated ? <RecipeForm /> : <Navigate replace to="/login" />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={isAuthenticated ? <RecipeForm /> : <Navigate replace to="/login" />} />
          <Route path="/my-recipes" element={isAuthenticated ? <MyRecipes /> : <Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
