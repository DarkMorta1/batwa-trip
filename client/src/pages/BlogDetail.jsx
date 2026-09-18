import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sanitizeRichText } from '../components/RichTextEditor'
import { getBlogSlug } from '../utils/tourSlug'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function BlogDetail(){
  const { slug } = useParams()
  const nav = useNavigate()
  const [blog, setBlog] = useState(null)

  useEffect(()=>{
    fetch(`${API}/api/blogs`).then(r=>r.json()).then(data=>{
      const found = data.find(b => {
        const candidateSlug = b.slug || getBlogSlug(b.title)
        return candidateSlug === slug || (b.id || b._id) === slug
      })
      setBlog(found || null)
    }).catch(()=>{
      setBlog(null)
    })
  }, [slug])

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

        {blog.thumb && (
          <div className="blog-image" style={{ marginTop: '24px', marginBottom: '24px' }}>
            <img 
              src={blog.thumb?.startsWith('http') ? blog.thumb : (blog.thumb?.startsWith('/') ? blog.thumb : `/images/${blog.thumb}`)} 
              alt={blog.title}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        )}

        <div className="blog-text rich-text-content" dangerouslySetInnerHTML={{ __html: sanitizeRichText(blog.content || '') }} />
      </div>
    </div>
  )
}
