import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function UsersPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [blockedFilter, setBlockedFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [blockedFilter, searchTerm])

  async function fetchUsers() {
    try {
      setLoading(true)
      let url = '/api/admin/users'
      const params = new URLSearchParams()
      if (blockedFilter) params.append('isBlocked', blockedFilter)
      if (searchTerm) params.append('search', searchTerm)
      if (params.toString()) url += `?${params.toString()}`
      
      const data = await apiRequest(url)
      setUsers(data.users || data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function toggleBlock(userId) {
    try {
      await apiRequest(`/api/admin/users/${userId}/block`, { method: 'PUT' })
      showToast('User status updated', 'success')
      fetchUsers()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteUser() {
    try {
      await apiRequest(`/api/admin/users/${selectedUser._id}`, { method: 'DELETE' })
      showToast('User deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
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
          <h1 className="admin-page-title">Users Management</h1>
          <p className="admin-page-subtitle">Manage user accounts</p>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <div className="admin-flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ maxWidth: '300px' }}
            />
            <div className="admin-flex admin-gap-3">
              <button
                onClick={() => setBlockedFilter('')}
                className={`admin-btn ${!blockedFilter ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              >
                All
              </button>
              <button
                onClick={() => setBlockedFilter('false')}
                className={`admin-btn ${blockedFilter === 'false' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              >
                Active
              </button>
              <button
                onClick={() => setBlockedFilter('true')}
                className={`admin-btn ${blockedFilter === 'true' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              >
                Blocked
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-text-center" style={{ padding: '40px' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className="admin-badge admin-badge-info">{user.role || 'user'}</span>
                    </td>
                    <td>
                      {user.isBlocked ? (
                        <span className="admin-badge admin-badge-danger">Blocked</span>
                      ) : (
                        <span className="admin-badge admin-badge-success">Active</span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => toggleBlock(user._id)}
                        className={`admin-btn ${user.isBlocked ? 'admin-btn-success' : 'admin-btn-danger'}`}
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setShowDeleteModal(true) }}
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

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedUser(null) }}
          onConfirm={deleteUser}
          title="Delete User"
          message={`Are you sure you want to delete user "${selectedUser?.email}"? This action cannot be undone.`}
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

