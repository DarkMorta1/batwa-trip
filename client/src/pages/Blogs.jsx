import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Blogs(){
  const nav = useNavigate()
  const [blogs, setBlogs] = useState([])

  useEffect(()=>{
    fetch(`${API}/api/blogs`)
      .then(r => {
        if (r.ok) return r.json()
        throw new Error('Failed to fetch blogs')
      })
      .then(data => setBlogs(data.map(d => ({ ...d, id: d.id || d._id }))))
      .catch(() => {
        console.warn('Failed to load blogs from backend')
      })
  }, [])

  return (
    <div style={{padding:'28px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <button className="back" onClick={() => nav('/')} style={{
          background: '#3f51b5',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#fff',
          transition: 'all 200ms',
          flexShrink: 0
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
        <h1 style={{color:'#fff', margin:0}}>Travel Blogs</h1>
      </div>
      <p style={{color:'rgba(255,255,255,0.85)', marginBottom:'24px'}}>Read stories from our travelers</p>
      
      <div className="blog-list">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <div className="blog-card-thumb" style={{backgroundImage:`url(${blog.thumb})`}} />
            <div className="blog-card-body">
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div className="meta">{blog.date} • {blog.author}</div>
              <div className="read-more" onClick={() => nav(`/blog/${blog.id}`)}>Read More →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
