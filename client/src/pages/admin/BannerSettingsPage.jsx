import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import Modal from '../../components/admin/Modal'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function BannerSettingsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [bannerData, setBannerData] = useState({
    images: [],
    title: '',
    eyebrow: '',
    rotationInterval: 4000,
    enabled: true
  })
  const [loading, setLoading] = useState(true)
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    fetchBannerSettings()
  }, [])

  async function fetchBannerSettings() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/banner')
      setBannerData(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function saveBannerSettings() {
    try {
      await apiRequest('/api/admin/banner', {
        method: 'PUT',
        body: JSON.stringify(bannerData)
      })
      showToast('Banner settings saved successfully', 'success')
      fetchBannerSettings()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  function addImage() {
    if (newImageUrl.trim()) {
      setBannerData({
        ...bannerData,
        images: [...bannerData.images, newImageUrl.trim()]
      })
      setNewImageUrl('')
    }
  }

  function removeImage(index) {
    setBannerData({
      ...bannerData,
      images: bannerData.images.filter((_, i) => i !== index)
    })
  }

  function moveImage(index, direction) {
    const newImages = [...bannerData.images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
      setBannerData({ ...bannerData, images: newImages })
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
          <h1 className="admin-page-title">Banner Settings</h1>
          <p className="admin-page-subtitle">Manage homepage banner images and text</p>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Banner Content</h2>
          
          <div className="admin-space-y-4">
            <div className="admin-form-group">
              <label className="admin-label">Eyebrow Text</label>
              <input
                type="text"
                value={bannerData.eyebrow}
                onChange={e => setBannerData({ ...bannerData, eyebrow: e.target.value })}
                className="admin-input"
                placeholder="e.g., Travel"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Main Title</label>
              <input
                type="text"
                value={bannerData.title}
                onChange={e => setBannerData({ ...bannerData, title: e.target.value })}
                className="admin-input"
                placeholder="e.g., TRAVEL WITH BATUWA"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Rotation Interval (milliseconds)</label>
              <input
                type="number"
                value={bannerData.rotationInterval}
                onChange={e => setBannerData({ ...bannerData, rotationInterval: parseInt(e.target.value) || 4000 })}
                className="admin-input"
                min="1000"
                step="1000"
              />
              <small className="admin-text-gray-600">Time between image changes (default: 4000ms = 4 seconds)</small>
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={bannerData.enabled}
                  onChange={e => setBannerData({ ...bannerData, enabled: e.target.checked })}
                />
                Enable Banner
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Banner Images</h2>
          
          <div className="admin-space-y-4">
            <div className="admin-form-group">
              <label className="admin-label">Add New Image</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addImage()}
                  className="admin-input"
                  placeholder="/images/banner1.jpg or full URL"
                />
                <button onClick={addImage} className="admin-btn admin-btn-primary">
                  Add
                </button>
              </div>
            </div>

            {bannerData.images.length === 0 ? (
              <div className="admin-text-center" style={{ padding: '40px', color: '#6b7280' }}>
                No images added. Add images to display in the banner.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {bannerData.images.map((image, index) => (
                  <div key={index} className="admin-card" style={{ padding: '12px' }}>
                    <img
                      src={image.startsWith('http') ? image : (image.startsWith('/') ? image : `/images/${image}`)}
                      alt={`Banner ${index + 1}`}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div className="admin-text-xs admin-text-gray-600" style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
                      {image.length > 30 ? image.substring(0, 30) + '...' : image}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '11px', flex: 1 }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === bannerData.images.length - 1}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '11px', flex: 1 }}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px', flex: 1 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={saveBannerSettings} className="admin-btn admin-btn-primary" style={{ padding: '12px 24px' }}>
            Save Banner Settings
          </button>
        </div>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

