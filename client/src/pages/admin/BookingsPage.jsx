import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest, authHeaders, API } from '../../utils/api'

export default function BookingsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  async function fetchBookings() {
    try {
      setLoading(true)
      const params = statusFilter ? `?status=${statusFilter}` : ''
      const data = await apiRequest(`/api/admin/bookings${params}`)
      setBookings(data.bookings || data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateBookingStatus(bookingId, status) {
    try {
      await apiRequest(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      showToast('Booking status updated', 'success')
      fetchBookings()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteBooking() {
    try {
      await apiRequest(`/api/admin/bookings/${selectedBooking._id}`, { method: 'DELETE' })
      showToast('Booking deleted', 'success')
      setShowDeleteModal(false)
      setSelectedBooking(null)
      fetchBookings()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function exportCSV() {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API}/api/admin/bookings/export/csv`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      showToast('Bookings exported successfully', 'success')
    } catch (error) {
      showToast('Export failed', 'error')
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
        <div className="admin-flex-between">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Bookings Management</h1>
            <p className="admin-page-subtitle">View and manage all bookings</p>
          </div>
          <button onClick={exportCSV} className="admin-btn admin-btn-success">
            Export CSV
          </button>
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
              onClick={() => setStatusFilter('pending')}
              className={`admin-btn ${statusFilter === 'pending' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`admin-btn ${statusFilter === 'approved' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Approved ({bookings.filter(b => b.status === 'approved').length})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`admin-btn ${statusFilter === 'cancelled' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Tour</th>
                <th>Travel Date</th>
                <th>Travelers</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="admin-text-center" style={{ padding: '40px' }}>
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{booking.customerName}</div>
                        <div className="admin-text-sm admin-text-gray-600">{booking.customerEmail}</div>
                        <div className="admin-text-sm admin-text-gray-600">{booking.customerPhone}</div>
                      </div>
                    </td>
                    <td>{booking.tourTitle || (booking.tourId?.title) || 'N/A'}</td>
                    <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                    <td>{booking.numberOfTravelers}</td>
                    <td style={{ fontWeight: '600' }}>RS{booking.totalAmount}</td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={e => updateBookingStatus(booking._id, e.target.value)}
                        className="admin-select"
                        style={{ padding: '4px 8px', fontSize: '12px', minWidth: '120px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => { setSelectedBooking(booking); setShowDeleteModal(true) }}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
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

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedBooking(null) }}
          onConfirm={deleteBooking}
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This action cannot be undone."
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
