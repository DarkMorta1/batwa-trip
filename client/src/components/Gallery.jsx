import React, { useState } from 'react'
import '../styles.css'

export default function Gallery({ photos = [] }){
  const [lightbox, setLightbox] = useState(null)
  const [showAll, setShowAll] = useState(false)
  
  const displayed = showAll ? photos : photos.slice(0, 6)
  
  const nav = (d) => {
    let idx = photos.indexOf(lightbox)
    idx = (idx + d + photos.length) % photos.length
    setLightbox(photos[idx])
  }

  return (
    <>
      <div className="gallery-grid">
        {displayed.map((photo, i) => (
          <div key={i} className="gallery-item" onClick={() => setLightbox(photo)}>
            <img src={photo} alt={`Gallery ${i}`} />
            <div className="gallery-overlay">View</div>
          </div>
        ))}
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
            <img src={lightbox} alt="Full" />
            {/* <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button> */}
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
