import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function BlogDetail(){
  const { id } = useParams()
  const nav = useNavigate()
  const [blog, setBlog] = useState(null)

  useEffect(()=>{
    // fetch list and find by id (server returns _id)
    fetch(`${API}/api/blogs`).then(r=>r.json()).then(data=>{
      const found = data.find(b => (b.id || b._id) === id)
      setBlog(found)
    }).catch(()=>{
      setBlog(null)
    })
  }, [id])

  if(blog === null) return <div style={{padding:40, color:'#fff'}}>Blog not found</div>

  return (
    <div style={{padding:'16px'}}>
      <button className="back" onClick={() => nav('/blogs')} style={{
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
        marginBottom: '16px'
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
      <div className="blog-detail">
  <h1>{blog.title}</h1>
  <div className="meta">{blog.date} • By {blog.author}</div>

  <div className="blog-detail-body">
    <div className="blog-text">
      {String(blog.content || '').split('\n').filter(p => p.trim()).map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </div>

    <div className="blog-image">
      <img src={blog.thumb} alt={blog.title} />
    </div>
  </div>
</div>
    </div>
  )
}
