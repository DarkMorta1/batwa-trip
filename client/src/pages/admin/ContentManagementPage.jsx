import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import { useToast } from '../../hooks/useToast'
import { apiRequest } from '../../utils/api'

const sections = [
  { id: 'hero', name: 'Hero Section', description: 'Main banner at the top of homepage' },
  { id: 'about', name: 'About Section', description: 'About us section' },
  { id: 'popular-tours', name: 'Popular Tours', description: 'Featured tours section' },
  { id: 'reviews', name: 'Reviews Section', description: 'Customer reviews section' },
  { id: 'gallery', name: 'Gallery Section', description: 'Photo gallery section' },
  { id: 'blog', name: 'Blog Section', description: 'Latest blog posts section' },
  { id: 'cta', name: 'Call to Action', description: 'Final CTA section' }
]

export default function ContentManagementPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [sectionsData, setSectionsData] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)

  useEffect(() => {
    fetchSections()
  }, [])

  async function fetchSections() {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/homepage-content')
      const sectionsMap = {}
      data.forEach(section => {
        sectionsMap[section.section] = section
      })
      setSectionsData(sectionsMap)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateSection(sectionId, updates) {
    try {
      await apiRequest(`/api/admin/homepage-content/${sectionId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      showToast('Section updated successfully', 'success')
      fetchSections()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  async function toggleSection(sectionId) {
    const section = sectionsData[sectionId] || { section: sectionId, enabled: false }
    await updateSection(sectionId, { ...section, enabled: !section.enabled })
  }

  function startEditing(sectionId) {
    const section = sectionsData[sectionId] || { section: sectionId, enabled: true, order: 0 }
    setEditingSection(section)
  }

  async function saveSection() {
    if (!editingSection) return
    await updateSection(editingSection.section, editingSection)
    setEditingSection(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Control homepage sections and content</p>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections.map(section => {
            const sectionData = sectionsData[section.id] || { section: section.id, enabled: true, order: 0 }
            return (
              <div key={section.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{section.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sectionData.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sectionData.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`px-4 py-2 rounded-lg ${
                        sectionData.enabled
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {sectionData.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => startEditing(section.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Edit Modal */}
        {editingSection && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setEditingSection(null)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit {sections.find(s => s.id === editingSection.section)?.name}</h2>
                    <button onClick={() => setEditingSection(null)} className="text-2xl">×</button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingSection.title || ''}
                        onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={editingSection.subtitle || ''}
                        onChange={e => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingSection.description || ''}
                        onChange={e => setEditingSection({ ...editingSection, description: e.target.value })}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingSection.image || ''}
                        onChange={e => setEditingSection({ ...editingSection, image: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveSection}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </AdminLayout>
  )
}

