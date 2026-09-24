import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../styles/admin.css'

const menuItems = [
  { path: '/admin/tours', label: 'Tours', icon: '🗺️' },
  { path: '/admin/blogs', label: 'Blogs', icon: '📝' },
  { path: '/admin/about', label: 'About Us', icon: '👥' },
  // { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  // { path: '/admin/vouchers', label: 'Offers & Coupons', icon: '🎫' },
  { path: '/admin/banner', label: 'Banner Settings', icon: '🎬' },
  // { path: '/admin/content', label: 'Content Management', icon: '📝' },
  { path: '/admin/media', label: 'Media Library', icon: '🖼️' },
  { path: '/admin/seo', label: 'SEO Settings', icon: '🔍' },
  { path: '/admin/theme', label: 'Branding & Theme', icon: '🎨' },
  { path: '/admin/settings', label: 'Website Settings', icon: '⚙️' },
  { path: '/admin/activity', label: 'Activity Logs', icon: '📋' }
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="admin-container">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="admin-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Hamburger Button */}
      <button
        className="admin-mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Logo/Header */}
          <div className="admin-sidebar-header">
            {sidebarOpen && <h1 className="admin-sidebar-title">Admin Panel</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-sidebar-toggle"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>

          {/* Menu */}
          <nav className="admin-sidebar-nav">
            <ul className="admin-nav-list">
              {menuItems.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path} className="admin-nav-item">
                    <Link
                      to={item.path}
                      className={`admin-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="admin-nav-icon">{item.icon}</span>
                      {sidebarOpen && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="admin-sidebar-footer">
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
            >
              <span>🚪</span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}

