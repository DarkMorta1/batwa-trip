import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function ThemeSettingsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [theme, setTheme] = useState({
    logo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    buttonStyle: 'rounded',
    buttonSize: 'medium',
    themeMode: 'light',
    customCSS: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTheme()
  }, [])

  async function fetchTheme() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/theme')
      setTheme(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function saveTheme() {
    try {
      await apiRequest('/api/admin/theme', {
        method: 'PUT',
        body: JSON.stringify(theme)
      })
      showToast('Theme settings saved successfully', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Branding & Theme</h1>
          <p className="admin-page-subtitle">Customize website appearance</p>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Branding</h2>
          <div className="admin-space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Logo URL</label>
                <input
                  type="text"
                  value={theme.logo}
                  onChange={e => setTheme({ ...theme, logo: e.target.value })}
                  className="admin-input"
                  placeholder="/images/logo.png"
                />
                {theme.logo && (
                  <img src={theme.logo.startsWith('http') ? theme.logo : (theme.logo.startsWith('/') ? theme.logo : `/images/${theme.logo}`)} 
                    alt="Logo preview" 
                    style={{ marginTop: '8px', maxHeight: '60px', maxWidth: '200px' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Favicon URL</label>
                <input
                  type="text"
                  value={theme.favicon}
                  onChange={e => setTheme({ ...theme, favicon: e.target.value })}
                  className="admin-input"
                  placeholder="/images/favicon.ico"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Colors</h2>
          <div className="admin-space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Primary Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                    style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Secondary Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
                    style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Accent Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={e => setTheme({ ...theme, accentColor: e.target.value })}
                    style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={e => setTheme({ ...theme, accentColor: e.target.value })}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Background Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={e => setTheme({ ...theme, backgroundColor: e.target.value })}
                    style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={e => setTheme({ ...theme, backgroundColor: e.target.value })}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Text Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={e => setTheme({ ...theme, textColor: e.target.value })}
                    style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={theme.textColor}
                    onChange={e => setTheme({ ...theme, textColor: e.target.value })}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Typography</h2>
          <div className="admin-space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Heading Font</label>
                <select
                  value={theme.headingFont}
                  onChange={e => setTheme({ ...theme, headingFont: e.target.value })}
                  className="admin-select"
                >
                  <option value="Inter">Inter</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Body Font</label>
                <select
                  value={theme.bodyFont}
                  onChange={e => setTheme({ ...theme, bodyFont: e.target.value })}
                  className="admin-select"
                >
                  <option value="Inter">Inter</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Buttons</h2>
          <div className="admin-space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Button Style</label>
                <select
                  value={theme.buttonStyle}
                  onChange={e => setTheme({ ...theme, buttonStyle: e.target.value })}
                  className="admin-select"
                >
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="pill">Pill</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Button Size</label>
                <select
                  value={theme.buttonSize}
                  onChange={e => setTheme({ ...theme, buttonSize: e.target.value })}
                  className="admin-select"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Theme Mode</h2>
          <div className="admin-form-group">
            <select
              value={theme.themeMode}
              onChange={e => setTheme({ ...theme, themeMode: e.target.value })}
              className="admin-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Custom CSS</h2>
          <div className="admin-form-group">
            <textarea
              value={theme.customCSS}
              onChange={e => setTheme({ ...theme, customCSS: e.target.value })}
              rows={10}
              className="admin-textarea"
              placeholder="/* Add your custom CSS here */"
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={saveTheme} className="admin-btn admin-btn-primary" style={{ padding: '12px 24px' }}>
            Save Theme Settings
          </button>
        </div>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

