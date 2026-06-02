import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [form, setForm] = useState({ Username: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/register', form)
      alert(res.data.message)
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Username" placeholder="Username" className="form-control mb-2" value={form.Username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="form-control mb-3" value={form.password} onChange={handleChange} required />
        <button className="btn btn-primary w-100" type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

export default Register
