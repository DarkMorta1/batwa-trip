import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sanitizeRichText, hasRichTextContent } from '../components/RichTextEditor'
import BackButton from '../components/BackButton'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const activityNames = ['Hiking', 'Trekking', 'Camping', 'Jeep Tours']

function imageUrl(value) {
  if (!value) return ''
  return value.startsWith('http') || value.startsWith('/') ? value : `/images/${value}`
}

export default function About() {
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${API}/api/about`)
      .then(response => {
        if (!response.ok) throw new Error('About content unavailable')
        return response.json()
      })
      .then(setContent)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const images = content?.customData?.images || []
  const description = content?.description?.trim() || ''
  const body = content?.content || ''
  const heroImage = imageUrl(content?.image) || '/images/logo.jpg'
  const activitySource = `${description} ${body}`.toLowerCase()
  const activities = activityNames.filter(activity => activitySource.includes(activity.toLowerCase()))

  return (
    <div className="about-page">
      <header className="logo-bar about-page__topbar" aria-label="About page navigation">
        <img src="/images/logo.jpg" alt="Batuwa Trip" className="logo" />
        <div className="about-page__back-wrap">
          <BackButton onClick={() => navigate('/')} />
        </div>
      </header>
      {loading && <div className="about-page__state">Loading About Us...</div>}
      {!loading && (error || !content) && (
        <div className="about-page__state">
          <h1>About Us</h1>
          <p>Our story is being prepared. Please check back soon.</p>
        </div>
      )}
      {!loading && content && (
        <>
          <section className="about-page__content">
            <div className="about-page__content-grid">
              <div className="about-page__story">
                <span className="about-page__section-label">Our story</span>
                <h1>{content.title || 'Explore Nepal Beyond the Ordinary'}</h1>
                {content.subtitle && <p className="about-page__subtitle">{content.subtitle}</p>}
                <span className="about-page__tagline">BE A PART OF A NEW TRAIL</span>
                {description && <p className="about-page__description">{description}</p>}
                {hasRichTextContent(body) && (
                  <div className="about-page__rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichText(body) }} />
                )}
                {!description && !hasRichTextContent(body) && <p className="about-page__empty">About Us content will appear here soon.</p>}
                {activities.length > 0 && (
                  <div className="about-page__activities" aria-label="Travel activities">
                    {activities.map(activity => <span key={activity}>{activity}</span>)}
                  </div>
                )}
              </div>
              <aside className="about-page__feature">
                <img src={imageUrl(images[0]) || heroImage} alt="A Batuwa Trip travel experience" />
                <div className="about-page__feature-copy">
                  <span>Travel with purpose</span>
                  <strong>Local insight. Open trails. Lasting memories.</strong>
                </div>
              </aside>
            </div>
            <div className="about-page__values" aria-label="Why travel with Batuwa Trip">
              <article><strong>100% Local Guides</strong><span>Travel with people who know Nepal deeply.</span></article>
              <article><strong>Tailored Itineraries</strong><span>Journeys shaped around your pace and interests.</span></article>
              <article><strong>Unexplored Trails</strong><span>Discover places beyond the ordinary route.</span></article>
            </div>
            {images.length > 1 && (
              <div className="about-page__gallery">
                {images.slice(1).map((image, index) => (
                  <img key={`${image}-${index}`} src={imageUrl(image)} alt={`Batuwa Trip ${index + 2}`} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}