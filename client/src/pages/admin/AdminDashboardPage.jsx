import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function AdminDashboardPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/dashboard/stats')
      setStats(data.stats)
      setMonthlyRevenue(data.monthlyRevenue || [])
      setRecentBookings(data.recentBookings || [])
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div>Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  const StatCard = ({ title, value, icon, color = 'blue' }) => {
    return (
      <div className="admin-stat-card">
        <div className="admin-stat-content">
          <p className="admin-stat-label">{title}</p>
          <p className="admin-stat-value">{value?.toLocaleString() || 0}</p>
        </div>
        <div className={`admin-stat-icon ${color}`}>
          {icon}
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-space-y-6">
        {/* Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="admin-grid admin-grid-4">
          <StatCard title="Total Users" value={stats?.totalUsers} icon="👥" color="blue" />
          <StatCard title="Total Bookings" value={stats?.totalBookings} icon="📅" color="green" />
          <StatCard title="Total Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || 0}`} icon="💰" color="purple" />
          <StatCard title="Published Tours" value={stats?.publishedTours} icon="🗺️" color="orange" />
        </div>

        {/* Secondary Stats */}
        <div className="admin-grid admin-grid-4">
          <StatCard title="Pending Bookings" value={stats?.pendingBookings} icon="⏳" color="orange" />
          <StatCard title="Approved Bookings" value={stats?.approvedBookings} icon="✅" color="green" />
          <StatCard title="Pending Inquiries" value={stats?.pendingInquiries} icon="💬" color="blue" />
          <StatCard title="Pending Reviews" value={stats?.pendingReviews} icon="⭐" color="purple" />
        </div>

        {/* Revenue Chart & Recent Bookings */}
        <div className="admin-grid admin-grid-2">
          {/* Monthly Revenue */}
          <div className="admin-card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Monthly Revenue (Last 6 Months)</h2>
            {monthlyRevenue.length > 0 ? (
              <div className="admin-space-y-3">
                {monthlyRevenue.map((item, index) => (
                  <div key={index} className="admin-flex-between">
                    <span className="admin-text-gray-600">
                      {new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <div className="admin-flex admin-gap-4">
                      <div className="admin-text-sm admin-text-gray-600">{item.bookings} bookings</div>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>${item.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-text-gray-600">No revenue data available</p>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="admin-card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Bookings</h2>
            {recentBookings.length > 0 ? (
              <div className="admin-space-y-3">
                {recentBookings.map(booking => (
                  <div key={booking._id} className="admin-flex-between" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                    <div>
                      <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{booking.customerName}</p>
                      <p className="admin-text-sm admin-text-gray-600" style={{ margin: 0 }}>{booking.tourTitle}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>${booking.totalAmount}</p>
                      <span className={`admin-badge ${
                        booking.status === 'approved' ? 'admin-badge-success' :
                        booking.status === 'pending' ? 'admin-badge-warning' :
                        'admin-badge-danger'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-text-gray-600">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-grid admin-grid-3">
          <div className="admin-card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Tours Overview</h3>
            <div className="admin-space-y-2">
              <div className="admin-flex-between">
                <span>Total Tours</span>
                <span style={{ fontWeight: 'bold' }}>{stats?.totalTours}</span>
              </div>
              <div className="admin-flex-between">
                <span>Published</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{stats?.publishedTours}</span>
              </div>
              <div className="admin-flex-between">
                <span>Hidden</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{stats?.hiddenTours}</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Bookings Overview</h3>
            <div className="admin-space-y-2">
              <div className="admin-flex-between">
                <span>Pending</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{stats?.pendingBookings}</span>
              </div>
              <div className="admin-flex-between">
                <span>Approved</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{stats?.approvedBookings}</span>
              </div>
              <div className="admin-flex-between">
                <span>Cancelled</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{stats?.cancelledBookings}</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Reviews Overview</h3>
            <div className="admin-space-y-2">
              <div className="admin-flex-between">
                <span>Approved</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{stats?.approvedReviews}</span>
              </div>
              <div className="admin-flex-between">
                <span>Pending</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{stats?.pendingReviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AdminLayout>
  )
}
