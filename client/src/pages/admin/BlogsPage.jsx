import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import Modal from '../../components/admin/Modal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest, API, authHeaders } from '../../utils/api'

export default function BlogsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    thumb: '',
    date: '',
    author: '',
    content: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/blogs')
      setBlogs(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openEditModal(blog = null) {
    if (blog) {
      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        thumb: blog.thumb || '',
        date: blog.date || new Date().toISOString().split('T')[0],
        author: blog.author || '',
        content: blog.content || ''
      })
      setSelectedBlog(blog)
    } else {
      setFormData({
        title: '',
        excerpt: '',
        thumb: '',
        date: new Date().toISOString().split('T')[0],
        author: '',
        content: ''
      })
      setSelectedBlog(null)
    }
    setShowModal(true)
  }

  async function saveBlog() {
    try {
      if (!formData.title || !formData.excerpt || !formData.thumb) {
        showToast('Please fill required fields (Title, Excerpt, Thumbnail)', 'error')
        return
      }

      const blogData = { ...formData }

      if (selectedBlog) {
        await apiRequest(`/api/blogs/${selectedBlog._id}`, {
          method: 'PUT',
          body: JSON.stringify(blogData)
        })
        showToast('Blog updated successfully', 'success')
      } else {
        await apiRequest('/api/blogs', {
          method: 'POST',
          body: JSON.stringify(blogData)
        })
        showToast('Blog created successfully', 'success')
      }
      setShowModal(false)
      fetchBlogs()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteBlog() {
    try {
      await apiRequest(`/api/blogs/${selectedBlog._id}`, { method: 'DELETE' })
      showToast('Blog deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedBlog(null)
      fetchBlogs()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error')
      return
    }

    try {
      setUploadingImage(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const token = localStorage.getItem('admin_token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: headers,
        body: uploadFormData
      })

      if (response.status === 401) {
        localStorage.removeItem('admin_token')
        window.location.href = '/admin/login'
        throw new Error('Unauthorized')
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, thumb: data.path }))
      showToast('Image uploaded successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Upload failed', 'error')
    } finally {
      setUploadingImage(false)
      e.target.value = '' // Reset input
    }
  }

  function removeImage() {
    setFormData(prev => ({ ...prev, thumb: '' }))
    showToast('Image removed', 'success')
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
            <h1 className="admin-page-title">Blogs Management</h1>
            <p className="admin-page-subtitle">Manage blog posts</p>
          </div>
          <button onClick={() => openEditModal()} className="admin-btn admin-btn-primary">
            + Create Blog
          </button>
        </div>

        {/* Blogs Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Blog</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-text-center" style={{ padding: '40px' }}>
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <div className="admin-flex" style={{ gap: '12px', alignItems: 'center' }}>
                        {blog.thumb && (
                          <img 
                            src={blog.thumb.startsWith('http') ? blog.thumb : (blog.thumb.startsWith('/') ? blog.thumb : `/images/${blog.thumb}`)} 
                            alt={blog.title} 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{blog.title}</div>
                          <div className="admin-text-sm admin-text-gray-600" style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {blog.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-text-gray-600">{blog.author || 'N/A'}</td>
                    <td className="admin-text-gray-600">{blog.date || 'N/A'}</td>
                    <td>
                      <div className="admin-flex admin-gap-3">
                        <button 
                          onClick={() => openEditModal(blog)} 
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => { setSelectedBlog(blog); setShowDeleteModal(true) }} 
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit/Create Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedBlog ? 'Edit Blog' : 'Create Blog'}
          size="xl"
        >
          <div className="admin-space-y-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="admin-form-group">
              <label className="admin-label">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Excerpt *</label>
              <textarea
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="admin-textarea"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Thumbnail Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="admin-input"
                disabled={uploadingImage}
                style={{ padding: '8px' }}
              />
              {uploadingImage && <div style={{ marginTop: '8px', color: '#6b7280' }}>Uploading...</div>}
              {formData.thumb && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={formData.thumb.startsWith('http') ? formData.thumb : (formData.thumb.startsWith('/') ? formData.thumb : `/images/${formData.thumb}`)} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="admin-btn admin-btn-danger"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      background: 'rgba(220, 38, 38, 0.9)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                    title="Remove image"
                  >
                    × Remove
                  </button>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Current: {formData.thumb}</div>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Content</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="admin-textarea"
                placeholder="Write your blog content here..."
              />
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                className="admin-btn admin-btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={saveBlog}
                className="admin-btn admin-btn-primary"
              >
                Save Blog
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedBlog(null) }}
          onConfirm={deleteBlog}
          title="Delete Blog"
          message={`Are you sure you want to delete "${selectedBlog?.title}"? This action cannot be undone.`}
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

