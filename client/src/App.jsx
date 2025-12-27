import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Tour from './pages/Tour'
import GalleryPage from './pages/GalleryPage'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import ToursPage from './pages/admin/ToursPage'
import ReviewsPage from './pages/admin/ReviewsPage'
import VouchersPage from './pages/admin/VouchersPage'
import BannerSettingsPage from './pages/admin/BannerSettingsPage'
import ContentManagementPage from './pages/admin/ContentManagementPage'
import MediaLibraryPage from './pages/admin/MediaLibraryPage'
import SEOSettingsPage from './pages/admin/SEOSettingsPage'
import ThemeSettingsPage from './pages/admin/ThemeSettingsPage'
import SettingsPage from './pages/admin/SettingsPage'
import ActivityLogsPage from './pages/admin/ActivityLogsPage'
import WhatsAppButton from './components/WhatsAppButton'
import AdminRoute from './components/AdminRoute'

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
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Admin routes don't show public header/nav
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><ToursPage /></AdminRoute>} />
        <Route path="/admin/tours" element={<AdminRoute><ToursPage /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><ReviewsPage /></AdminRoute>} />
        <Route path="/admin/vouchers" element={<AdminRoute><VouchersPage /></AdminRoute>} />
        <Route path="/admin/banner" element={<AdminRoute><BannerSettingsPage /></AdminRoute>} />
        <Route path="/admin/content" element={<AdminRoute><ContentManagementPage /></AdminRoute>} />
        <Route path="/admin/media" element={<AdminRoute><MediaLibraryPage /></AdminRoute>} />
        <Route path="/admin/seo" element={<AdminRoute><SEOSettingsPage /></AdminRoute>} />
        <Route path="/admin/theme" element={<AdminRoute><ThemeSettingsPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
        <Route path="/admin/activity" element={<AdminRoute><ActivityLogsPage /></AdminRoute>} />
      </Routes>
    )
  }

  // Public routes
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
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}

