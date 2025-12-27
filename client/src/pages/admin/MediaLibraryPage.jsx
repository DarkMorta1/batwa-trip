import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest, authHeaders, API } from '../../utils/api'

export default function MediaLibraryPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/gallery')
      setGallery(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: token ? authHeaders() : {},
        body: formData
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()
      showToast(`Image uploaded: ${data.path}`, 'success')
      fetchGallery()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  async function deleteMedia() {
    try {
      await apiRequest(`/api/gallery/${selectedItem._id}`, { method: 'DELETE' })
      showToast('Media deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedItem(null)
      fetchGallery()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  function copyPath(path) {
    navigator.clipboard.writeText(path)
    showToast('Path copied to clipboard', 'success')
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
        <div className="admin-flex-between">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Media Library</h1>
            <p className="admin-page-subtitle">Manage images and media files</p>
          </div>
          <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
            {uploading ? 'Uploading...' : '+ Upload Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>

        {gallery.length === 0 ? (
          <div className="admin-card admin-text-center" style={{ padding: '60px' }}>
            <p className="admin-text-gray-600">No media files. Upload your first image!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {gallery.map(item => (
              <div key={item._id} className="admin-card" style={{ padding: '12px' }}>
                <img
                  src={item.path.startsWith('http') ? item.path : (item.path.startsWith('/') ? item.path : `/images/${item.path}`)}
                  alt={item.caption || 'Media'}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <div className="admin-text-sm admin-text-gray-600" style={{ 
                  marginBottom: '8px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {item.caption || item.path}
                </div>
                <div className="admin-text-xs admin-text-gray-600" style={{ marginBottom: '8px', fontFamily: 'monospace' }}>
                  {item.path.length > 30 ? item.path.substring(0, 30) + '...' : item.path}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => copyPath(item.path)}
                    className="admin-btn admin-btn-ghost"
                    style={{ padding: '4px 8px', fontSize: '11px', flex: 1 }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => { setSelectedItem(item); setShowDeleteModal(true) }}
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

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedItem(null) }}
          onConfirm={deleteMedia}
          title="Delete Media"
          message="Are you sure you want to delete this media file? This action cannot be undone."
          confirmText="Delete"
          danger
        />
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

