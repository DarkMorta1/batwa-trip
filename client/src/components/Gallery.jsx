import React, { useState } from 'react'
import '../styles.css'

export default function Gallery({ photos = [] }){
  const [lightbox, setLightbox] = useState(null)
  const [showAll, setShowAll] = useState(false)
  
  const displayed = showAll ? photos : photos.slice(0, 6)
  
  const nav = (d) => {
    const normalizedPhotos = photos.map(photo => 
      photo?.startsWith('http') 
        ? photo 
        : photo?.startsWith('/') 
          ? photo 
          : `/images/${photo || 'placeholder.jpg'}`
    )
    let idx = normalizedPhotos.indexOf(lightbox)
    idx = (idx + d + normalizedPhotos.length) % normalizedPhotos.length
    setLightbox(normalizedPhotos[idx])
  }

  return (
    <>
      <div className="gallery-grid">
        {displayed.map((photo, i) => {
          const photoSrc = photo?.startsWith('http') 
            ? photo 
            : photo?.startsWith('/') 
              ? photo 
              : `/images/${photo || 'placeholder.jpg'}`
          return (
            <div key={i} className="gallery-item" onClick={() => setLightbox(photoSrc)}>
              <img 
                src={photoSrc} 
                alt={`Gallery ${i + 1}`}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                }}
              />
              <div className="gallery-overlay">View</div>
            </div>
          )
        })}
      </div>
      {!showAll && photos.length > 6 && (
        <div style={{textAlign:'center', marginTop:'20px'}}>
          <button className="see-more-btn" onClick={() => setShowAll(true)}>
            See More Photos
          </button>
        </div>
      )}
      
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(null)
              }}
              style={{
                position: 'fixed',
                top: '15px',
                right: '15px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                fontSize: '28px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10001,
                lineHeight: '1',
                padding: 0,
                transition: 'all 0.2s',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.9)'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.7)'
                e.target.style.transform = 'scale(1)'
              }}
              onTouchStart={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.9)'
                e.target.style.transform = 'scale(1.1)'
              }}
              onTouchEnd={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.7)'
                e.target.style.transform = 'scale(1)'
              }}
              aria-label="Close image"
            >
              ×
            </button>
            <img src={lightbox} alt="Full" />
            <div className="lightbox-nav">
              <button onClick={() => nav(-1)}>‹</button>
              <button onClick={() => nav(1)}>›</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
