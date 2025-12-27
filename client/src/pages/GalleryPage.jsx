import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Gallery from '../components/Gallery'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function GalleryPage(){
  const nav = useNavigate()
  const [photos, setPhotos] = useState([])

  useEffect(()=>{
    fetch(`${API}/api/gallery`).then(r=>r.json()).then(data=>{
      setPhotos(data.map(d=>d.path))
    }).catch(()=>setPhotos([]))
  }, [])
  
  return (
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
        touchAction: 'manipulation',
        marginBottom: '12px'
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
      <h1 style={{color:'#fff', marginBottom:'12px', fontSize: 'clamp(20px, 5vw, 28px)'}}>Memories from Our Tours</h1>
      <p style={{color:'rgba(255,255,255,0.85)', marginBottom:'24px', fontSize: 'clamp(13px, 3vw, 15px)'}}>Gallery of beautiful moments captured by our travelers</p>
      <Gallery photos={photos} />
    </div>
  )
}
