import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Toast from '../../components/admin/Toast'
import RichTextEditor from '../../components/RichTextEditor'
import { useToast } from '../../hooks/useToast'
import { apiRequest, API, authHeaders } from '../../utils/api'

const emptyContent = { section: 'about-us', enabled: true, title: '', subtitle: '', description: '', content: '', image: '', customData: { images: [] } }

function imageUrl(value) {
  if (!value) return ''
  return value.startsWith('http') || value.startsWith('/') ? value : `/images/${value}`
}

export default function AboutUsPage() {
  const { toasts, showToast, removeToast } = useToast()
  const [content, setContent] = useState(emptyContent)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    apiRequest('/api/admin/homepage-content/about-us')
      .then(data => setContent({ ...emptyContent, ...data, customData: { images: [], ...(data.customData || {}) } }))
      .catch(error => showToast(error.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  async function uploadImage(event, multiple = false) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    try {
      setUploading(true)
      const paths = []
      for (const file of files) {
        if (!file.type.startsWith('image/')) throw new Error('Please upload image files only')
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch(`${API}/api/upload`, { method: 'POST', headers: authHeaders(), body: formData })
        if (!response.ok) throw new Error('Image upload failed')
        paths.push((await response.json()).path)
      }
      setContent(previous => multiple
        ? { ...previous, customData: { ...previous.customData, images: [...(previous.customData.images || []), ...paths] } }
        : { ...previous, image: paths[0] })
      showToast('Image uploaded successfully', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  async function saveContent() {
    try {
      await apiRequest('/api/admin/homepage-content/about-us', { method: 'PUT', body: JSON.stringify(content) })
      showToast('About Us content saved successfully', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  function moveImage(index, direction) {
    const images = [...(content.customData.images || [])]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= images.length) return
    ;[images[index], images[target]] = [images[target], images[index]]
    setContent({ ...content, customData: { ...content.customData, images } })
  }

  if (loading) return <AdminLayout><div className="admin-loading">Loading...</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="admin-space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">About Us</h1>
          <p className="admin-page-subtitle">Manage the public About Us page</p>
        </div>
        <div className="admin-card admin-space-y-4">
          <div className="admin-form-group"><label className="admin-label">Title</label><input className="admin-input" value={content.title} onChange={e => setContent({ ...content, title: e.target.value })} /></div>
          <div className="admin-form-group"><label className="admin-label">Subtitle</label><input className="admin-input" value={content.subtitle} onChange={e => setContent({ ...content, subtitle: e.target.value })} /></div>
          <div className="admin-form-group"><label className="admin-label">Description</label><textarea className="admin-textarea" rows="3" value={content.description} onChange={e => setContent({ ...content, description: e.target.value })} /></div>
          <div className="admin-form-group"><label className="admin-label">Content</label><RichTextEditor value={content.content} onChange={value => setContent({ ...content, content: value })} placeholder="Write your About Us content..." /></div>
          <div className="admin-form-group">
            <label className="admin-label">Hero Image</label>
            <input className="admin-input" type="file" accept="image/*" onChange={event => uploadImage(event)} disabled={uploading} />
            {content.image && <img className="about-admin-preview" src={imageUrl(content.image)} alt="Hero preview" />}
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Additional Photos</label>
            <input className="admin-input" type="file" accept="image/*" multiple onChange={event => uploadImage(event, true)} disabled={uploading} />
            <div className="about-admin-gallery">
              {(content.customData.images || []).map((image, index) => <div key={`${image}-${index}`}><img src={imageUrl(image)} alt={`Additional ${index + 1}`} /><div><button type="button" className="admin-btn admin-btn-ghost" onClick={() => moveImage(index, 'up')} disabled={index === 0}>↑</button><button type="button" className="admin-btn admin-btn-ghost" onClick={() => moveImage(index, 'down')} disabled={index === content.customData.images.length - 1}>↓</button><button type="button" className="admin-btn admin-btn-danger" onClick={() => setContent({ ...content, customData: { ...content.customData, images: content.customData.images.filter((_, itemIndex) => itemIndex !== index) } })}>Remove</button></div></div>)}
            </div>
          </div>
          <label className="admin-label"><input type="checkbox" checked={content.enabled} onChange={e => setContent({ ...content, enabled: e.target.checked })} /> Publish About Us page</label>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button onClick={saveContent} className="admin-btn admin-btn-primary">Save About Us</button></div>
        </div>
      </div>
      {toasts.map(toast => <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />)}
    </AdminLayout>
  )
}