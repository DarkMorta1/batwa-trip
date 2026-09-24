import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sanitizeRichText } from '../components/RichTextEditor'
import { getBlogSlug } from '../utils/tourSlug'
import BackButton from '../components/BackButton'

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
    <div className="subpage-page" style={{padding:'16px'}}>
      <BackButton onClick={() => nav('/blogs')} />
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
