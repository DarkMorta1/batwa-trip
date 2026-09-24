import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Gallery from '../components/Gallery'
import BackButton from '../components/BackButton'

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
      <BackButton onClick={() => nav('/')} />
      <h1 style={{color:'#fff', marginBottom:'12px', fontSize: 'clamp(20px, 5vw, 28px)'}}>Memories from Our Tours</h1>
      <p style={{color:'rgba(255,255,255,0.85)', marginBottom:'24px', fontSize: 'clamp(13px, 3vw, 15px)'}}>Gallery of beautiful moments captured by our travelers</p>
      <Gallery photos={photos} />
    </div>
  )
}
