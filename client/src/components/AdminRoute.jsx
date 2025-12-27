import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { apiRequest } from '../utils/api'

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      // Use fetch directly for verify to handle JSON parsing better
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setAuthorized(true)
        } else {
          localStorage.removeItem('admin_token')
          setAuthorized(false)
        }
      } else {
        localStorage.removeItem('admin_token')
        setAuthorized(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('admin_token')
      setAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    )
  }

  return authorized ? children : <Navigate to="/admin/login" replace />
}

