import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildWhatsAppLink } from '../constants/whatsapp'
import { getTourSlug } from '../utils/tourSlug'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function TravelCard({ tour }) {
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)

  const shareTour = useCallback(async () => {
    const url = `${window.location.origin}/tour/${getTourSlug(tour.title)}`
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
        <div className="trend-card__media-badges">
          {tour.location && <span className="badge badge--tag">{tour.location}</span>}
          {tour.difficulty && <span className="badge badge--tag badge--tag--secondary">{tour.difficulty}</span>}
        </div>
        {tour.showPrice !== false && <span className="badge badge--price">NPR {tour.price}</span>}
      </div>
      <div className="trend-card__body">
        <h3 className="trend-card__title">{tour.title}</h3>
        <p className="trend-card__meta">
          {tour.days} Days • {tour.location}
          {tour.difficulty && (
            <span className="trend-card__difficulty">{tour.difficulty}</span>
          )}
        </p>
        <div className="trend-card__actions">
          <button
            className="btn btn--pink trend-card__details"
            onClick={() => nav(`/tour/${getTourSlug(tour.title)}`)}
          >
            Details
          </button>
          <a
            className="btn btn--ghost trend-card__customize"
            href={buildWhatsAppLink(customizeMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Customize trip for ${tour.title || 'this package'} via WhatsApp`}
          >
            Customize
          </a>
          <button
            className="btn trend-card__share"
            onClick={shareTour}
            aria-label={`Share ${tour.title}`}
            title="Share trip"
          >
            {copied ? '✓' : '↗'}
          </button>
          {copied && <span className="share__copied">Link copied</span>}
        </div>
      </div>
    </article>
  )
}
