import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

export default function SettingsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [settings, setSettings] = useState({
    siteName: '',
    siteTagline: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    address: '',
    googleMapsUrl: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    maintenanceMode: false,
    maintenanceMessage: '',
    bookingEnabled: true,
    currency: 'USD',
    currencySymbol: 'RS',
    timezone: 'UTC'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/website-settings')
      setSettings(data)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    try {
      await apiRequest('/api/admin/website-settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      })
      showToast('Settings saved successfully', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-600 mt-1">Global website configuration</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Tagline</label>
                <input
                  type="text"
                  value={settings.siteTagline}
                  onChange={e => setSettings({ ...settings, siteTagline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={e => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={e => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="url"
                  value={settings.socialLinks.twitter}
                  onChange={e => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                <input
                  type="url"
                  value={settings.socialLinks.youtube}
                  onChange={e => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Maintenance Mode</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="mr-2"
                />
                Enable Maintenance Mode
              </label>
              {settings.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={e => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Booking Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Settings</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.bookingEnabled}
                onChange={e => setSettings({ ...settings, bookingEnabled: e.target.checked })}
                className="mr-2"
              />
              Enable Booking System
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

