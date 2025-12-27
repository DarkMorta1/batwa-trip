import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildWhatsAppLink } from '../constants/whatsapp'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function TravelCard({ tour }) {
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)

  const shareTour = useCallback(async () => {
    const url = `${window.location.origin}/tour/${tour.id}`
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({ title: tour.title, url })
        return
      } catch (e) {
        // fall back to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Last resort: prompt
      // eslint-disable-next-line no-alert
      window.prompt('Copy this link', url)
    }
  }, [tour])

  // voucher validation removed from card; handled on tour detail page
  const customizeMessage = `Hi, I would like to customize a trip.${tour.title ? ` Package: ${tour.title}.` : ''}${tour.location ? ` Destination: ${tour.location}.` : ''}${tour.days ? ` Duration: ${tour.days} days.` : ''}`

  return (
    <article className="trend-card">
      <div className="trend-card__media">
        <img 
          src={
            tour.img?.startsWith('http') 
              ? tour.img 
              : tour.img?.startsWith('/') 
                ? tour.img 
                : `/images/${tour.img || 'placeholder.jpg'}`
          } 
          alt={tour.title}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg'
          }}
        />
        {tour.showPrice !== false && <span className="badge badge--price">${tour.price}</span>}
      </div>
      <div className="trend-card__body">
        <h3 className="trend-card__title">{tour.title}</h3>
        <p className="trend-card__meta">
          {tour.days} Days • {tour.location}
          {tour.difficulty && (
            <span style={{ marginLeft: '8px', textTransform: 'capitalize' }}>
              • {tour.difficulty}
            </span>
          )}
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button
            className="btn btn--pink"
            onClick={() => nav(`/tour/${tour.id}`)}
          >
            Details
          </button>
          <a
            className="btn btn--ghost"
            href={buildWhatsAppLink(customizeMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Customize trip for ${tour.title || 'this package'} via WhatsApp`}
          >
            Customize 
          </a>
          <button
            className="btn btn--ghost"
            onClick={shareTour}
            aria-label={`Share ${tour.title}`}
          >
            Share 
          </button>
          {copied && <span className="share__copied">Link copied</span>}
          </div>

          {/* <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <div style={{marginLeft:'auto', fontWeight:700}}>${tour.price}</div>
          </div> */}
        </div>
      </div>
    </article>
  )
}
