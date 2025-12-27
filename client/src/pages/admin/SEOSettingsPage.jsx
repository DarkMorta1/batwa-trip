import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

const pages = ['home', 'tours', 'blogs', 'contact', 'gallery', 'about']

export default function SEOSettingsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [settings, setSettings] = useState({})
  const [selectedPage, setSelectedPage] = useState('home')
  const [loading, setLoading] = useState(true)
  const [currentSettings, setCurrentSettings] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    customSlug: ''
  })
  const [keywordInput, setKeywordInput] = useState('')

  useEffect(() => {
    fetchAllSettings()
  }, [])

  useEffect(() => {
    loadPageSettings()
  }, [selectedPage, settings])

  async function fetchAllSettings() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/seo')
      const settingsMap = {}
      data.forEach(setting => {
        settingsMap[setting.page] = setting
      })
      setSettings(settingsMap)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function loadPageSettings() {
    const pageSettings = settings[selectedPage] || {}
    setCurrentSettings({
      metaTitle: pageSettings.metaTitle || '',
      metaDescription: pageSettings.metaDescription || '',
      metaKeywords: pageSettings.metaKeywords || [],
      ogTitle: pageSettings.ogTitle || '',
      ogDescription: pageSettings.ogDescription || '',
      ogImage: pageSettings.ogImage || '',
      canonicalUrl: pageSettings.canonicalUrl || '',
      customSlug: pageSettings.customSlug || ''
    })
  }

  async function saveSettings() {
    try {
      await apiRequest(`/api/admin/seo/${selectedPage}`, {
        method: 'PUT',
        body: JSON.stringify(currentSettings)
      })
      showToast('SEO settings saved successfully', 'success')
      fetchAllSettings()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  function addKeyword() {
    if (keywordInput.trim() && !currentSettings.metaKeywords.includes(keywordInput.trim())) {
      setCurrentSettings({
        ...currentSettings,
        metaKeywords: [...currentSettings.metaKeywords, keywordInput.trim()]
      })
      setKeywordInput('')
    }
  }

  function removeKeyword(keyword) {
    setCurrentSettings({
      ...currentSettings,
      metaKeywords: currentSettings.metaKeywords.filter(k => k !== keyword)
    })
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
          <h1 className="admin-page-title">SEO Settings</h1>
          <p className="admin-page-subtitle">Configure SEO for all pages</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
          {/* Page Selector */}
          <div className="admin-card">
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Pages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`admin-btn ${selectedPage === page ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                  style={{ textAlign: 'left', textTransform: 'capitalize' }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Form */}
          <div className="admin-card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'capitalize' }}>
              {selectedPage} Page SEO
            </h2>

            <div className="admin-space-y-4">
              <div className="admin-form-group">
                <label className="admin-label">Meta Title</label>
                <input
                  type="text"
                  value={currentSettings.metaTitle}
                  onChange={e => setCurrentSettings({ ...currentSettings, metaTitle: e.target.value })}
                  className="admin-input"
                  placeholder="Page title for search engines"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Meta Description</label>
                <textarea
                  value={currentSettings.metaDescription}
                  onChange={e => setCurrentSettings({ ...currentSettings, metaDescription: e.target.value })}
                  rows={3}
                  className="admin-textarea"
                  placeholder="Page description for search engines (150-160 characters recommended)"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Meta Keywords</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addKeyword()}
                    className="admin-input"
                    placeholder="Add keyword and press Enter"
                  />
                  <button onClick={addKeyword} className="admin-btn admin-btn-secondary">
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentSettings.metaKeywords.map((keyword, index) => (
                    <span key={index} className="admin-badge admin-badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">OpenGraph Title</label>
                <input
                  type="text"
                  value={currentSettings.ogTitle}
                  onChange={e => setCurrentSettings({ ...currentSettings, ogTitle: e.target.value })}
                  className="admin-input"
                  placeholder="Title for social media sharing"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">OpenGraph Description</label>
                <textarea
                  value={currentSettings.ogDescription}
                  onChange={e => setCurrentSettings({ ...currentSettings, ogDescription: e.target.value })}
                  rows={3}
                  className="admin-textarea"
                  placeholder="Description for social media sharing"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">OpenGraph Image URL</label>
                <input
                  type="text"
                  value={currentSettings.ogImage}
                  onChange={e => setCurrentSettings({ ...currentSettings, ogImage: e.target.value })}
                  className="admin-input"
                  placeholder="/images/og-image.jpg"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Canonical URL</label>
                <input
                  type="text"
                  value={currentSettings.canonicalUrl}
                  onChange={e => setCurrentSettings({ ...currentSettings, canonicalUrl: e.target.value })}
                  className="admin-input"
                  placeholder="https://yoursite.com/page"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Custom Slug (optional)</label>
                <input
                  type="text"
                  value={currentSettings.customSlug}
                  onChange={e => setCurrentSettings({ ...currentSettings, customSlug: e.target.value })}
                  className="admin-input"
                  placeholder="custom-url-slug"
                />
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={saveSettings} className="admin-btn admin-btn-primary">
                  Save SEO Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

