import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function ActivityLogsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [resourceFilter, setResourceFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchLogs()
  }, [resourceFilter, page])

  async function fetchLogs() {
    try {
      setLoading(true)
      let url = '/api/admin/activity-logs'
      const params = new URLSearchParams()
      if (resourceFilter) params.append('resource', resourceFilter)
      params.append('page', page)
      if (params.toString()) url += `?${params.toString()}`
      
      const data = await apiRequest(url)
      setLogs(data.logs || data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading...</div>
      </AdminLayout>
    )
  }

  const resources = ['tour', 'booking', 'user', 'review', 'voucher', 'settings', 'seo', 'theme', 'content']

  return (
    <AdminLayout>
      <div className="admin-space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Activity Logs</h1>
          <p className="admin-page-subtitle">View admin activity history</p>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <div className="admin-flex admin-gap-3" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() => setResourceFilter('')}
              className={`admin-btn ${!resourceFilter ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              All Resources
            </button>
            {resources.map(resource => (
              <button
                key={resource}
                onClick={() => setResourceFilter(resource)}
                className={`admin-btn ${resourceFilter === resource ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {resource}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Details</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-text-center" style={{ padding: '40px' }}>
                    No activity logs found
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id}>
                    <td style={{ fontWeight: '600' }}>{log.adminUsername || log.adminId?.username}</td>
                    <td>
                      <span className={`admin-badge ${
                        log.action === 'create' ? 'admin-badge-success' :
                        log.action === 'update' ? 'admin-badge-info' :
                        log.action === 'delete' ? 'admin-badge-danger' :
                        'admin-badge-warning'
                      }`} style={{ textTransform: 'capitalize' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{log.resource}</td>
                    <td className="admin-text-sm admin-text-gray-600" style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.details}
                    </td>
                    <td className="admin-text-sm admin-text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="admin-flex-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="admin-btn admin-btn-ghost"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={logs.length < 50}
            className="admin-btn admin-btn-ghost"
          >
            Next
          </button>
        </div>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

