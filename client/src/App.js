import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from "./component/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
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
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
