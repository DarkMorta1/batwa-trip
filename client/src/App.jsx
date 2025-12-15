import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Tour from './pages/Tour'
import GalleryPage from './pages/GalleryPage'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import WhatsAppButton from './components/WhatsAppButton'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/gallery', label: 'Gallery', icon: '🖼️' },
  { path: '/blogs', label: 'Blogs', icon: '📖' },
  { path: '/contact', label: 'Contact', icon: '📞' },
]

function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = pathname === item.path
        const Tag = item.disabled ? 'button' : Link
        const props = item.disabled
          ? { type: 'button', disabled: true }
          : { to: item.path }

        return (
          <Tag
            key={item.path}
            className={`nav-btn ${isActive ? 'nav-btn--active' : ''}`}
            {...props}
          >
            <span className="icon" aria-hidden>{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Tag>
        )
      })}
    </nav>
  )
}

export default function App() {
  return (
    <div className="page">
      <header className="logo-bar">
        <img src="/images/logo.jpg" alt="Logo" className="logo" />
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tour/:id" element={<Tour />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

        <BottomNav />
        <WhatsAppButton />
    </div>
  )
}

