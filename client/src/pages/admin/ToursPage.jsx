import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import Modal from '../../components/admin/Modal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest, API, authHeaders } from '../../utils/api'

export default function ToursPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    fullDescription: '',
    img: '',
    price: 0,
    showPrice: true,
    discountPrice: 0,
    discountPercent: 0,
    days: 1,
    nights: 0,
    location: '',
    difficulty: 'moderate',
    status: 'draft',
    trending: false,
    upcoming: false,
    featured: false,
    photos: [],
    videos: [],
    mapUrl: '',
    maxGroupSize: 15,
    minGroupSize: 2,
    includes: [],
    excludes: [],
    itinerary: [],
    details: {
      expenses: '',
      cancellationPolicy: '',
      highlights: [],
      requirements: []
    }
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    fetchTours()
  }, [statusFilter])

  async function fetchTours() {
    try {
      setLoading(true)
      const url = statusFilter === 'all' ? '/api/tours?status=all' : `/api/tours?status=${statusFilter}`
      const data = await apiRequest(url)
      setTours(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openEditModal(tour = null) {
    if (tour) {
      // Normalize itinerary - convert old 'day' to 'dayNumber' if needed
      const normalizedItinerary = (tour.itinerary || []).map((day, index) => ({
        dayNumber: day.dayNumber || day.day || index + 1,
        title: day.title || `Day ${day.dayNumber || day.day || index + 1}`,
        description: day.description || ''
      }))
      
      setFormData({
        ...tour,
        showPrice: tour.showPrice !== undefined ? tour.showPrice : true,
        itinerary: normalizedItinerary,
        photos: tour.photos || [],
        includes: tour.includes || [],
        excludes: tour.excludes || [],
        details: tour.details || { expenses: '', cancellationPolicy: '', highlights: [], requirements: [] }
      })
      setSelectedTour(tour)
    } else {
      setFormData({
        title: '', desc: '', fullDescription: '', img: '', price: 0, showPrice: true, discountPrice: 0, discountPercent: 0,
        days: 1, nights: 0, location: '', difficulty: 'moderate', status: 'draft',
        trending: false, upcoming: false, featured: false, photos: [], videos: [], mapUrl: '',
        maxGroupSize: 15, minGroupSize: 2, includes: [], excludes: [], itinerary: [],
        details: { expenses: '', cancellationPolicy: '', highlights: [], requirements: [] }
      })
      setSelectedTour(null)
    }
    setShowModal(true)
  }

  async function saveTour() {
    try {
      if (!formData.title || !formData.img || !formData.desc || !formData.location) {
        showToast('Please fill required fields (Title, Image, Description, Location)', 'error')
        return
      }
      
      // Validate itinerary - ensure all days have required fields
      const invalidDays = formData.itinerary.filter(day => !day.title || !day.description)
      if (invalidDays.length > 0) {
        showToast('Please fill in both title and description for all itinerary days', 'error')
        return
      }

      // Ensure dayNumber is set for all itinerary items
      const normalizedItinerary = formData.itinerary.map((day, index) => ({
        dayNumber: day.dayNumber || index + 1,
        title: day.title,
        description: day.description
      }))

      const tourData = {
        ...formData,
        itinerary: normalizedItinerary
      }

      if (selectedTour) {
        await apiRequest(`/api/tours/${selectedTour._id}`, {
          method: 'PUT',
          body: JSON.stringify(tourData)
        })
        showToast('Tour updated successfully', 'success')
      } else {
        await apiRequest('/api/tours', {
          method: 'POST',
          body: JSON.stringify(tourData)
        })
        showToast('Tour created successfully', 'success')
      }
      setShowModal(false)
      fetchTours()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteTour() {
    try {
      await apiRequest(`/api/tours/${selectedTour._id}`, { method: 'DELETE' })
      showToast('Tour deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedTour(null)
      fetchTours()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function handleAdditionalPhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error')
      return
    }

    try {
      setUploadingPhoto(true)
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
      setFormData(prev => ({ ...prev, photos: [...prev.photos, data.path] }))
      showToast('Photo uploaded successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Upload failed', 'error')
    } finally {
      setUploadingPhoto(false)
      e.target.value = '' // Reset input
    }
  }

  function removePhoto(index) {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) })
    showToast('Photo removed', 'success')
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
      // Don't set Content-Type header - let browser set it with boundary for FormData
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
      setFormData(prev => ({ ...prev, img: data.path }))
      showToast('Image uploaded successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Upload failed', 'error')
    } finally {
      setUploadingImage(false)
      e.target.value = '' // Reset input
    }
  }

  function removeImage() {
    setFormData(prev => ({ ...prev, img: '' }))
    showToast('Image removed', 'success')
  }

  // Itinerary management functions
  function addItineraryDay() {
    const newDayNumber = formData.itinerary.length + 1
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        {
          dayNumber: newDayNumber,
          title: `Day ${newDayNumber} – `,
          description: ''
        }
      ]
    })
  }

  function updateItineraryDay(index, field, value) {
    const updated = [...formData.itinerary]
    updated[index] = { ...updated[index], [field]: value }
    // Auto-update dayNumber if title changes to match pattern
    if (field === 'title' && value.startsWith('Day ')) {
      const dayMatch = value.match(/Day\s+(\d+)/)
      if (dayMatch) {
        updated[index].dayNumber = parseInt(dayMatch[1])
      }
    }
    setFormData({ ...formData, itinerary: updated })
  }

  function removeItineraryDay(index) {
    const updated = formData.itinerary.filter((_, i) => i !== index)
    // Renumber remaining days
    const renumbered = updated.map((day, i) => ({
      ...day,
      dayNumber: i + 1,
      title: day.title.replace(/Day\s+\d+/, `Day ${i + 1}`)
    }))
    setFormData({ ...formData, itinerary: renumbered })
  }

  function moveItineraryDay(index, direction) {
    const updated = [...formData.itinerary]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < updated.length) {
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]]
      // Renumber all days
      const renumbered = updated.map((day, i) => ({
        ...day,
        dayNumber: i + 1,
        title: day.title.replace(/Day\s+\d+/, `Day ${i + 1}`)
      }))
      setFormData({ ...formData, itinerary: renumbered })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading...</div>
      </AdminLayout>
    )
  }

  const filteredTours = statusFilter === 'all' ? tours : tours.filter(t => t.status === statusFilter)

  return (
    <AdminLayout>
      <div className="admin-space-y-6">
        <div className="admin-flex-between">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Tours Management</h1>
            <p className="admin-page-subtitle">Manage all tour packages</p>
          </div>
          <button onClick={() => openEditModal()} className="admin-btn admin-btn-primary">
            + Create Tour
          </button>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <div className="admin-flex admin-gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`admin-btn ${statusFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              All ({tours.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`admin-btn ${statusFilter === 'published' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Published ({tours.filter(t => t.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`admin-btn ${statusFilter === 'draft' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Draft ({tours.filter(t => t.status === 'draft').length})
            </button>
            <button
              onClick={() => setStatusFilter('hidden')}
              className={`admin-btn ${statusFilter === 'hidden' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Hidden ({tours.filter(t => t.status === 'hidden').length})
            </button>
          </div>
        </div>

        {/* Tours Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>Price</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-text-center" style={{ padding: '40px' }}>
                    No tours found
                  </td>
                </tr>
              ) : (
                filteredTours.map(tour => (
                  <tr key={tour._id}>
                    <td>
                      <div className="admin-flex" style={{ gap: '12px', alignItems: 'center' }}>
                        {tour.img && (
                          <img 
                            src={tour.img.startsWith('http') ? tour.img : (tour.img.startsWith('/') ? tour.img : `/images/${tour.img}`)} 
                            alt={tour.title} 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{tour.title}</div>
                          <div className="admin-text-sm admin-text-gray-600">{tour.days} days</div>
                        </div>
                      </div>
                    </td>
                    <td>${tour.price}</td>
                    <td>
                      <span className={`admin-badge ${
                        tour.status === 'published' ? 'admin-badge-success' :
                        tour.status === 'draft' ? 'admin-badge-warning' :
                        'admin-badge-danger'
                      }`}>
                        {tour.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {tour.featured && <span className="admin-badge admin-badge-info">Featured</span>}
                        {tour.trending && <span className="admin-badge admin-badge-info">Trending</span>}
                        {tour.upcoming && <span className="admin-badge admin-badge-info">Upcoming</span>}
                      </div>
                    </td>
                    <td className="admin-text-gray-600">{tour.location}</td>
                    <td>
                      <div className="admin-flex admin-gap-3">
                        <button 
                          onClick={() => openEditModal(tour)} 
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => { setSelectedTour(tour); setShowDeleteModal(true) }} 
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
          title={selectedTour ? 'Edit Tour' : 'Create Tour'}
          size="xl"
        >
          <div className="admin-space-y-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <label className="admin-label">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Description *</label>
              <textarea
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                rows={3}
                className="admin-textarea"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="admin-input"
                  required
                />
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showPrice: !formData.showPrice })}
                    className="admin-btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      background: formData.showPrice ? '#e5e7eb' : '#3f51b5',
                      color: formData.showPrice ? '#1f2937' : '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Price ({formData.showPrice ? 'Show' : 'Hide'})
                  </button>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Days *</label>
                <input
                  type="number"
                  value={formData.days}
                  onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="admin-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="admin-input"
                disabled={uploadingImage}
                style={{ padding: '8px' }}
              />
              {uploadingImage && <div style={{ marginTop: '8px', color: '#6b7280' }}>Uploading...</div>}
              {formData.img && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={formData.img.startsWith('http') ? formData.img : (formData.img.startsWith('/') ? formData.img : `/images/${formData.img}`)} 
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
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Current: {formData.img}</div>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Additional Photos</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAdditionalPhotoUpload}
                className="admin-input"
                disabled={uploadingPhoto}
                style={{ padding: '8px', marginBottom: '8px' }}
              />
              {uploadingPhoto && <div style={{ marginBottom: '8px', color: '#6b7280' }}>Uploading...</div>}
              {formData.photos && formData.photos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '12px' }}>
                  {formData.photos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={photo.startsWith('http') ? photo : (photo.startsWith('/') ? photo : `/images/${photo}`)} 
                        alt={`Photo ${index + 1}`} 
                        style={{ 
                          width: '100%', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }} 
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="admin-btn admin-btn-danger"
                        style={{ 
                          position: 'absolute', 
                          top: '4px', 
                          right: '4px', 
                          padding: '4px 8px',
                          fontSize: '11px',
                          borderRadius: '4px',
                          background: 'rgba(220, 38, 38, 0.9)', 
                          color: 'white', 
                          border: 'none', 
                          cursor: 'pointer',
                          zIndex: 10,
                          minWidth: 'auto',
                          minHeight: 'auto'
                        }}
                        title="Remove photo"
                      >
                        × Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {(!formData.photos || formData.photos.length === 0) && (
                <div style={{ marginTop: '8px', padding: '16px', background: '#f9fafb', borderRadius: '6px', textAlign: 'center', color: '#6b7280' }}>
                  No additional photos. Upload photos to display in the tour gallery.
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.trending}
                    onChange={e => setFormData({ ...formData, trending: e.target.checked })}
                  />
                  Available
                </label>
                {/* <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured
                </label> */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.upcoming}
                    onChange={e => setFormData({ ...formData, upcoming: e.target.checked })}
                  />
                  Upcoming
                </label>
              </label>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                className="admin-select"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Itinerary Section */}
            <div className="admin-form-group" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label className="admin-label" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                  Day-wise Tour Itinerary
                </label>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  + Add Day
                </button>
              </div>

              {formData.itinerary.length === 0 ? (
                <div className="admin-text-center" style={{ padding: '40px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>
                  No itinerary days added. Click "Add Day" to create the tour itinerary.
                </div>
              ) : (
                <div className="admin-space-y-4">
                  {formData.itinerary.map((day, index) => (
                    <div key={index} className="admin-card" style={{ padding: '16px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="admin-badge admin-badge-info" style={{ fontSize: '14px', padding: '6px 12px' }}>
                            Day {day.dayNumber || index + 1}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => moveItineraryDay(index, 'up')}
                            disabled={index === 0}
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItineraryDay(index, 'down')}
                            disabled={index === formData.itinerary.length - 1}
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Delete day"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                        <label className="admin-label">Day Title *</label>
                        <input
                          type="text"
                          value={day.title || ''}
                          onChange={e => updateItineraryDay(index, 'title', e.target.value)}
                          className="admin-input"
                          placeholder={`Day ${day.dayNumber || index + 1} – Arrival & City Tour`}
                          required
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Detailed Description *</label>
                        <textarea
                          value={day.description || ''}
                          onChange={e => updateItineraryDay(index, 'description', e.target.value)}
                          className="admin-textarea"
                          rows={5}
                          placeholder="Describe activities, places to visit, meals included, accommodation details, etc."
                          required
                        />
                        <small className="admin-text-gray-600">Include activities, places, meals, stay information</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                className="admin-btn admin-btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={saveTour}
                className="admin-btn admin-btn-primary"
              >
                Save Tour
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedTour(null) }}
          onConfirm={deleteTour}
          title="Delete Tour"
          message={`Are you sure you want to delete "${selectedTour?.title}"? This action cannot be undone.`}
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
