import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function login(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      // store token in localStorage for admin routes
      localStorage.setItem('admin_token', data.token)
      nav('/admin')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#fff' }}>Admin Login</h2>
      <form onSubmit={login} style={{ maxWidth: 420, marginTop: 18 }}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e6e6e6'}} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #e6e6e6',marginTop:12}} />
        <button className="btn btn--pink" style={{marginTop:12}} type="submit">Login</button>
        {error && <div style={{color:'salmon',marginTop:12}}>{error}</div>}
      </form>
    </div>
  )
}
