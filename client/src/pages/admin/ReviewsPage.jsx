import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import Modal from '../../components/admin/Modal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function ReviewsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReview, setSelectedReview] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMessage, setEditMessage] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [statusFilter])

  async function fetchReviews() {
    try {
      setLoading(true)
      let url = '/api/reviews'
      if (statusFilter === 'approved') url += '?approved=true'
      else if (statusFilter === 'pending') url += '?approved=false'
      
      const data = await apiRequest(url)
      setReviews(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateReview(updates) {
    try {
      await apiRequest(`/api/reviews/${selectedReview._id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      showToast('Review updated successfully', 'success')
      setShowEditModal(false)
      fetchReviews()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function toggleApprove(reviewId, currentStatus) {
    try {
      await apiRequest(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ approved: !currentStatus })
      })
      showToast(`Review ${!currentStatus ? 'approved' : 'unapproved'}`, 'success')
      fetchReviews()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function toggleFeature(reviewId, currentStatus) {
    try {
      await apiRequest(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !currentStatus })
      })
      showToast(`Review ${!currentStatus ? 'featured' : 'unfeatured'}`, 'success')
      fetchReviews()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function toggleHide(reviewId, currentStatus) {
    try {
      await apiRequest(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ hidden: !currentStatus })
      })
      showToast(`Review ${!currentStatus ? 'hidden' : 'visible'}`, 'success')
      fetchReviews()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteReview() {
    try {
      await apiRequest(`/api/reviews/${selectedReview._id}`, { method: 'DELETE' })
      showToast('Review deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedReview(null)
      fetchReviews()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  function openEditModal(review) {
    setSelectedReview(review)
    setEditMessage(review.message)
    setShowEditModal(true)
  }

  async function saveEdit() {
    await updateReview({ message: editMessage })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading...</div>
      </AdminLayout>
    )
  }

  const filteredReviews = statusFilter === '' ? reviews : 
    statusFilter === 'approved' ? reviews.filter(r => r.approved) :
    reviews.filter(r => !r.approved)

  return (
    <AdminLayout>
      <div className="admin-space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Reviews Management</h1>
          <p className="admin-page-subtitle">Approve and manage customer reviews</p>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <div className="admin-flex admin-gap-3">
            <button
              onClick={() => setStatusFilter('')}
              className={`admin-btn ${!statusFilter ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`admin-btn ${statusFilter === 'approved' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Approved ({reviews.filter(r => r.approved).length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`admin-btn ${statusFilter === 'pending' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Pending ({reviews.filter(r => !r.approved).length})
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Tour</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-text-center" style={{ padding: '40px' }}>
                    No reviews found
                  </td>
                </tr>
              ) : (
                filteredReviews.map(review => (
                  <tr key={review._id}>
                    <td style={{ fontWeight: '600' }}>{review.author}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {review.rating} ⭐
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.message}
                    </td>
                    <td>{review.tourTitle || review.tourId?.title || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {review.approved ? (
                          <span className="admin-badge admin-badge-success">Approved</span>
                        ) : (
                          <span className="admin-badge admin-badge-warning">Pending</span>
                        )}
                        {review.featured && <span className="admin-badge admin-badge-info">Featured</span>}
                        {review.hidden && <span className="admin-badge admin-badge-danger">Hidden</span>}
                      </div>
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                          onClick={() => toggleApprove(review._id, review.approved)}
                          className={`admin-btn ${review.approved ? 'admin-btn-warning' : 'admin-btn-success'}`}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          {review.approved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          onClick={() => toggleFeature(review._id, review.featured)}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          {review.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => openEditModal(review)}
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setSelectedReview(review); setShowDeleteModal(true) }}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
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

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Review"
          size="md"
        >
          {selectedReview && (
            <div className="admin-space-y-4">
              <div>
                <strong>Author:</strong> {selectedReview.author}
              </div>
              <div>
                <strong>Rating:</strong> {selectedReview.rating} ⭐
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Review Message</label>
                <textarea
                  value={editMessage}
                  onChange={e => setEditMessage(e.target.value)}
                  rows={6}
                  className="admin-textarea"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <button onClick={() => setShowEditModal(false)} className="admin-btn admin-btn-ghost">
                  Cancel
                </button>
                <button onClick={saveEdit} className="admin-btn admin-btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedReview(null) }}
          onConfirm={deleteReview}
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
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

