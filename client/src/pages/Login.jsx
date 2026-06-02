import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('Username', res.data.Username)
      if (onLogin) onLogin()
      navigate('/home')
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="form-control mb-3" value={form.password} onChange={handleChange} required />
        <button className="btn btn-primary w-100" type="submit">Login</button>
        <p>New User? <Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}

export default Login
