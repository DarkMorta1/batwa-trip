import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBlogSlug } from '../utils/tourSlug'
import BackButton from '../components/BackButton'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Blogs(){
  const nav = useNavigate()
  const [blogs, setBlogs] = useState([])

  useEffect(()=>{
    // Use display-settings endpoint to get blogs in admin-defined order
    fetch(`${API}/api/display-settings/blogs`)
      .then(r => {
        if (r.ok) return r.json()
        throw new Error('Failed to fetch blogs')
      })
      .then(data => setBlogs(data.map(d => ({ ...d, id: d.id || d._id, slug: d.slug || getBlogSlug(d.title) }))))
      .catch(() => {
        console.warn('Failed to load blogs from backend')
      })
  }, [])

  return (
    <div style={{padding:'28px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <BackButton onClick={() => nav('/')} />
        <h1 style={{color:'#fff', margin:0}}>Travel Blogs</h1>
      </div>
      <p style={{color:'rgba(255,255,255,0.85)', marginBottom:'24px'}}>Read stories from our travelers</p>
      
      {blogs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
          <p>No blogs available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map(blog => {
            const imageUrl = blog.thumb?.startsWith('http') 
              ? blog.thumb 
              : blog.thumb?.startsWith('/') 
                ? blog.thumb 
                : `/images/${blog.thumb || 'placeholder.jpg'}`
            const blogSlug = blog.slug || getBlogSlug(blog.title)
            return (
              <div key={blog.id} className="blog-card">
                <div className="blog-card-thumb" style={{backgroundImage:`url(${imageUrl})`}} />
                <div className="blog-card-body">
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <div className="meta">{blog.date} • {blog.author}</div>
                  <div className="read-more" onClick={() => nav(`/blog/${blogSlug}`)}>Read More →</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
