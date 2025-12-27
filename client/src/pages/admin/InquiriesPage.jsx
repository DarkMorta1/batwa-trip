import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import Modal from '../../components/admin/Modal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function InquiriesPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [statusFilter])

  async function fetchInquiries() {
    try {
      setLoading(true)
      const url = statusFilter ? `/api/admin/inquiries?status=${statusFilter}` : '/api/admin/inquiries'
      const data = await apiRequest(url)
      setInquiries(data.inquiries || data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(inquiryId, status) {
    try {
      await apiRequest(`/api/admin/inquiries/${inquiryId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      showToast('Status updated successfully', 'success')
      fetchInquiries()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function saveNotes() {
    try {
      await apiRequest(`/api/admin/inquiries/${selectedInquiry._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ adminNotes })
      })
      showToast('Notes saved successfully', 'success')
      setShowDetailModal(false)
      fetchInquiries()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteInquiry() {
    try {
      await apiRequest(`/api/admin/inquiries/${selectedInquiry._id}`, { method: 'DELETE' })
      showToast('Inquiry deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedInquiry(null)
      fetchInquiries()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  function viewDetails(inquiry) {
    setSelectedInquiry(inquiry)
    setAdminNotes(inquiry.adminNotes || '')
    setShowDetailModal(true)
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
          <h1 className="admin-page-title">Inquiries Management</h1>
          <p className="admin-page-subtitle">Manage customer inquiries and messages</p>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <div className="admin-flex admin-gap-3">
            <button
              onClick={() => setStatusFilter('')}
              className={`admin-btn ${!statusFilter ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`admin-btn ${statusFilter === 'new' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              New ({inquiries.filter(i => i.status === 'new').length})
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`admin-btn ${statusFilter === 'read' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Read
            </button>
            <button
              onClick={() => setStatusFilter('replied')}
              className={`admin-btn ${statusFilter === 'replied' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Replied
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-text-center" style={{ padding: '40px' }}>
                    No inquiries found
                  </td>
                </tr>
              ) : (
                inquiries.map(inquiry => (
                  <tr key={inquiry._id}>
                    <td style={{ fontWeight: '600' }}>{inquiry.name}</td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.subject}</td>
                    <td>
                      <select
                        value={inquiry.status}
                        onChange={e => updateStatus(inquiry._id, e.target.value)}
                        className="admin-select"
                        style={{ padding: '4px 8px', fontSize: '12px', minWidth: '100px' }}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => viewDetails(inquiry)}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => { setSelectedInquiry(inquiry); setShowDeleteModal(true) }}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 12px', fontSize: '13px', marginLeft: '8px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Inquiry Details"
          size="md"
        >
          {selectedInquiry && (
            <div className="admin-space-y-4">
              <div>
                <strong>Name:</strong> {selectedInquiry.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedInquiry.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedInquiry.phone || 'N/A'}
              </div>
              <div>
                <strong>Subject:</strong> {selectedInquiry.subject}
              </div>
              <div>
                <strong>Message:</strong>
                <div style={{ marginTop: '8px', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
                  {selectedInquiry.message}
                </div>
              </div>
              {selectedInquiry.tourId && (
                <div>
                  <strong>Related Tour:</strong> {selectedInquiry.tourId?.title || selectedInquiry.tourId}
                </div>
              )}
              <div className="admin-form-group">
                <label className="admin-label">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  rows={4}
                  className="admin-textarea"
                  placeholder="Add notes about this inquiry..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <button onClick={() => setShowDetailModal(false)} className="admin-btn admin-btn-ghost">
                  Close
                </button>
                <button onClick={saveNotes} className="admin-btn admin-btn-primary">
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedInquiry(null) }}
          onConfirm={deleteInquiry}
          title="Delete Inquiry"
          message="Are you sure you want to delete this inquiry? This action cannot be undone."
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

