import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Gallery from '../components/Gallery'
import { sanitizeRichText, hasRichTextContent } from '../components/RichTextEditor'
import { getTourSlug } from '../utils/tourSlug'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Tour(){
  const { slug } = useParams()
  const nav = useNavigate()
  const [tour, setTour] = useState(null)

  useEffect(()=>{
    window.scrollTo(0, 0)
    // Fetch all tours (including published) to find the specific one
    fetch(`${API}/api/tours?status=published`)
      .then(r => {
        if (r.ok) return r.json()
        throw new Error('Failed to fetch tours')
      })
      .then(data => {
        // Keep ID fallback for existing bookmarks while public links use title slugs.
        const found = data.map(d=>({ ...d, id: d.id || d._id })).find(t => 
          (getTourSlug(t.title) === slug || t.id === slug || t._id === slug || t.slug === slug) && t.status === 'published'
        )
        if (found) {
          setTour(found)
        } else {
          setTour(null)
        }
      })
      .catch(() => {
        console.error('Failed to load tour')
        setTour(null)
      })
  }, [slug])


  const scrollToContact = () => {
    if (window.location.pathname !== '/'){
      nav('/')
      setTimeout(()=>{
        const el = document.getElementById('contact')
        if(el) el.scrollIntoView({behavior:'smooth'})
      }, 200)
    } else {
      const el = document.getElementById('contact')
      if(el) el.scrollIntoView({behavior:'smooth'})
    }
  }

  if(tour === null) return <div style={{padding:40, color:'#fff'}}>Please Wait</div>

  const descriptionHtml = sanitizeRichText(tour.desc || '')

  const normalizeFurtherInfoSections = (value) => {
    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .map((section, index) => ({
          id: section?.id || `legacy-section-${index}`,
          title: typeof section?.title === 'string' ? section.title.trim() : '',
          content: typeof section?.content === 'string' ? section.content : ''
        }))
        .filter(section => section.title || section.content)
        .map((section, index) => ({
          ...section,
          title: section.title || `Section ${index + 1}`
        }))
    }

    if (typeof value === 'string' && value.trim()) {
      return [{ id: 'legacy-further-info', title: 'Further Information', content: value }]
    }

    return []
  }

  const furtherInfoSections = normalizeFurtherInfoSections(tour.details?.furtherInfo)

  return (
    <div className="tour-page">
      <div style={{padding:'16px'}}>
        <button className="back" onClick={() => nav('/')} style={{
          background: '#3f51b5',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#fff',
          transition: 'all 200ms',
          touchAction: 'manipulation'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2d3a8c'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#3f51b5'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        >←</button>
      </div>

      <div className="tour-hero" style={{backgroundImage:`url(${tour.img})`}}>
        <div className="hero-overlay">
          <h1>{tour.title}</h1>
          <p>
            {tour.location} • {tour.days} days
            {tour.difficulty && (
              <span style={{ textTransform: 'capitalize' }}> • {tour.difficulty}</span>
            )}
          </p>
        </div>
      </div>

      <div className="tour-content">
        <div className="left">
          <h2>About this tour</h2>
          <div className="tour-rich-text" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          
          {/* Day-wise Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <>
              <h3 style={{ marginTop: '32px', marginBottom: '20px' }}>Tour Itinerary</h3>
              <div className="itinerary-timeline" style={{ marginBottom: '32px' }}>
                {tour.itinerary
                  .sort((a, b) => (a.dayNumber || a.day || 0) - (b.dayNumber || b.day || 0))
                  .map((day, index) => (
                    <div key={index} className="itinerary-day" style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderLeft: '4px solid #3f51b5',
                      position: 'relative'
                    }}>
                      <div className="itinerary-day-content" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                        <div className="itinerary-day-number" style={{
                          minWidth: '60px',
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)'
                        }}>
                          {day.dayNumber || day.day || index + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h4 style={{
                            margin: '0 0 12px 0',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1a1a1a'
                          }}>
                            {day.title || `Day ${day.dayNumber || day.day || index + 1}`}
                          </h4>
                          <p style={{
                            margin: 0,
                            lineHeight: '1.6',
                            color: '#555',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                          }}>
                            {day.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          <h3>Gallery</h3>
          {tour.photos && tour.photos.length > 0 ? (
            <Gallery photos={tour.photos} />
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No gallery images available</p>
          )}

          {furtherInfoSections.length > 0 && (
            <div className="tour-further-info">
              <h3>Further Information</h3>
              {furtherInfoSections.map((section, index) => (
                <div key={section.id || index} style={{ marginBottom: '24px' }}>
                  {section.title && <h4 style={{ marginBottom: '12px' }}>{section.title}</h4>}
                  {hasRichTextContent(section.content) && (
                    <div className="tour-rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichText(section.content) }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="right">
          <div className="box">
            <h3>Price</h3>
            {tour.showPrice !== false ? (
              <div className="price big">RS{tour.price}</div>
            ) : (
              <div style={{fontSize:16,fontWeight:700,color:'#2ecc71'}}>
                Price hidden
              </div>
            )}

            <p className="muted" style={{marginTop:12}}>{tour.details?.expenses}</p>
            <button
  className="btn"
  onClick={() => window.open("https://wa.me/9779801113349", "_blank")}
  style={{ width:'100%', minHeight:'44px', padding:'12px 20px', marginBottom: '8px' }}
>
  Inquiry Now
</button>

<button
  className="btn"
  onClick={() => window.open("https://forms.gle/vyEDLUAQUj8dSUvt8", "_blank")}
  style={{ width:'100%', minHeight:'44px', padding:'12px 20px' }}
>
  Book Now
</button>


          </div>
        </aside>
      </div>
    </div>
  )
}

