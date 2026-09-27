import React, { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Hero with subtle auto-rotation but fixed overlay text to match design
export default function Banner() {
  const [idx, setIdx] = useState(0)
  const [bannerData, setBannerData] = useState({
    images: [
      '/images/1765290625930.JPG',
      '/images/1765290625942.JPG',
      '/images/1765290625950.jpg',
      '/images/1765290626003.jpg'
    ],
    title: 'BATUWA TRIP',
    eyebrow: 'BE A PART OF A NEW TRAIL, PROMOTING DOMESTIC TOURISM',
    rotationInterval: 4000,
    enabled: true
  })

  useEffect(() => {
    // Fetch banner settings from backend
    fetch(`${API}/api/banner`)
      .then(r => {
        if (r.ok) return r.json()
        throw new Error('Failed to fetch banner settings')
      })
      .then(data => {
        if (data.enabled && data.images && data.images.length > 0) {
          setBannerData(data)
        }
      })
      .catch(error => {
        console.warn('Failed to load banner settings, using defaults:', error)
        // Keep default values
      })
  }, [])

  useEffect(() => {
    if (!bannerData.enabled || !bannerData.images || bannerData.images.length === 0) return
    
    const interval = bannerData.rotationInterval || 4000
    const t = setInterval(() => {
      setIdx(i => (i + 1) % bannerData.images.length)
    }, interval)
    return () => clearInterval(t)
  }, [bannerData.images, bannerData.rotationInterval, bannerData.enabled])

  if (!bannerData.enabled) {
    return null
  }

  const currentImage = bannerData.images[idx] || bannerData.images[0]

  return (
    <section className="hero">
      <div
        className="hero__image"
        style={{ backgroundImage: `url(${currentImage.startsWith('http') ? currentImage : (currentImage.startsWith('/') ? currentImage : `/images/${currentImage}`)})` }}
      >
        <img src="/images/logo.jpg" alt="Batuwa Travels" className="hero__logo" />
        <div className="hero__overlay">
          <div className="hero__brand">
            <p className="hero__eyebrow">{bannerData.eyebrow}</p>
            <h1 className="hero__title">{bannerData.title}</h1>
            <p className="hero__lead">
              Experience hand-crafted Himalayan treks, alpine high passes, pristine glacial lakes, and rugged jeep expeditions built for mindful explorers and domestic adventurers.
            </p>
            <div className="hero__actions">
              <button
                className="btn btn--pink hero__explore"
                type="button"
                onClick={() => document.getElementById('trips')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Explore
              </button>
              <button
                className="btn btn--ghost hero__about-btn"
                type="button"
                onClick={() => window.location.assign('/about')}
              >
                About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
