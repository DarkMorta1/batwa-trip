import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import Modal from '../../components/admin/Modal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useToast } from '../../hooks/useToast'
import { apiRequest, API } from '../../utils/api'

export default function VouchersPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [vouchers, setVouchers] = useState([])
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    applicableTours: [],
    validFrom: '',
    validUntil: '',
    usageLimit: null,
    active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [vData, tData] = await Promise.all([
        apiRequest('/api/vouchers'),
        apiRequest('/api/tours?status=published')
      ])
      setVouchers(vData)
      setTours(tData)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openEditModal(voucher = null) {
    if (voucher) {
      setFormData({
        ...voucher,
        validFrom: voucher.validFrom ? new Date(voucher.validFrom).toISOString().split('T')[0] : '',
        validUntil: voucher.validUntil ? new Date(voucher.validUntil).toISOString().split('T')[0] : '',
        applicableTours: voucher.applicableTours?.map(t => t._id || t) || []
      })
      setSelectedVoucher(voucher)
    } else {
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 0,
        maxDiscountAmount: null,
        applicableTours: [],
        validFrom: '',
        validUntil: '',
        usageLimit: null,
        active: true
      })
      setSelectedVoucher(null)
    }
    setShowModal(true)
  }

  async function saveVoucher() {
    try {
      if (!formData.code) {
        showToast('Voucher code is required', 'error')
        return
      }
      if (selectedVoucher) {
        await apiRequest(`/api/vouchers/${selectedVoucher._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        })
        showToast('Voucher updated successfully', 'success')
      } else {
        await apiRequest('/api/vouchers', {
          method: 'POST',
          body: JSON.stringify(formData)
        })
        showToast('Voucher created successfully', 'success')
      }
      setShowModal(false)
      fetchData()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function deleteVoucher() {
    try {
      await apiRequest(`/api/vouchers/${selectedVoucher._id}`, { method: 'DELETE' })
      showToast('Voucher deleted successfully', 'success')
      setShowDeleteModal(false)
      setSelectedVoucher(null)
      fetchData()
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
        <div className="admin-flex-between">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Offers & Coupons</h1>
            <p className="admin-page-subtitle">Manage discount vouchers and offers</p>
          </div>
          <button onClick={() => openEditModal()} className="admin-btn admin-btn-primary">
            + Create Voucher
          </button>
        </div>

        {/* Vouchers List */}
        <div className="admin-grid admin-grid-2">
          {vouchers.length === 0 ? (
            <div className="admin-card admin-text-center" style={{ gridColumn: '1 / -1', padding: '40px' }}>
              No vouchers found. Create your first voucher!
            </div>
          ) : (
            vouchers.map(voucher => (
              <div key={voucher._id} className="admin-card">
                <div className="admin-flex-between" style={{ marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                      {voucher.code}
                    </h3>
                    {voucher.description && (
                      <p className="admin-text-sm admin-text-gray-600" style={{ margin: 0 }}>
                        {voucher.description}
                      </p>
                    )}
                  </div>
                  <span className={`admin-badge ${voucher.active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                    {voucher.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="admin-space-y-2" style={{ marginBottom: '12px' }}>
                  <div className="admin-flex-between">
                    <span className="admin-text-sm">Discount:</span>
                    <span style={{ fontWeight: '600' }}>
                      {voucher.discountType === 'percentage' 
                        ? `${voucher.discountValue}%`
                        : `$${voucher.discountValue}`}
                    </span>
                  </div>
                  {voucher.usageLimit && (
                    <div className="admin-flex-between">
                      <span className="admin-text-sm">Usage:</span>
                      <span className="admin-text-sm">
                        {voucher.usageCount || 0} / {voucher.usageLimit}
                      </span>
                    </div>
                  )}
                  <div className="admin-flex-between">
                    <span className="admin-text-sm">Valid:</span>
                    <span className="admin-text-sm">
                      {new Date(voucher.validFrom).toLocaleDateString()} - {new Date(voucher.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="admin-flex admin-gap-3">
                  <button
                    onClick={() => openEditModal(voucher)}
                    className="admin-btn admin-btn-ghost"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { setSelectedVoucher(voucher); setShowDeleteModal(true) }}
                    className="admin-btn admin-btn-danger"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedVoucher ? 'Edit Voucher' : 'Create Voucher'}
          size="lg"
        >
          <div className="admin-space-y-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                  className="admin-select"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="admin-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Discount Value *</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={e => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  className="admin-input"
                  required
                />
              </div>
              {formData.discountType === 'percentage' && (
                <div className="admin-form-group">
                  <label className="admin-label">Max Discount Amount (optional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount || ''}
                    onChange={e => setFormData({ ...formData, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null })}
                    className="admin-input"
                    placeholder="Leave empty for no limit"
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Valid From *</label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Valid Until *</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Minimum Purchase Amount</label>
                <input
                  type="number"
                  value={formData.minPurchaseAmount}
                  onChange={e => setFormData({ ...formData, minPurchaseAmount: parseFloat(e.target.value) || 0 })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Usage Limit (optional)</label>
                <input
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={e => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                  className="admin-input"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Applicable Tours (leave empty for all tours)</label>
              <select
                multiple
                value={formData.applicableTours}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value)
                  setFormData({ ...formData, applicableTours: selected })
                }}
                className="admin-select"
                style={{ minHeight: '100px' }}
              >
                {tours.map(tour => (
                  <option key={tour._id} value={tour._id}>{tour.title}</option>
                ))}
              </select>
              <small className="admin-text-gray-600">Hold Ctrl/Cmd to select multiple</small>
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} className="admin-btn admin-btn-ghost">
                Cancel
              </button>
              <button onClick={saveVoucher} className="admin-btn admin-btn-primary">
                Save Voucher
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedVoucher(null) }}
          onConfirm={deleteVoucher}
          title="Delete Voucher"
          message={`Are you sure you want to delete voucher "${selectedVoucher?.code}"? This action cannot be undone.`}
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

