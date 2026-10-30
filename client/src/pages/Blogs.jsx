import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBlogSlug } from '../utils/tourSlug'
import BackButton from '../components/BackButton'
import SEOHead from '../components/SEOHead'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getBlogPreview(blog) {
  const source = blog.excerpt || blog.description || blog.content || ''
  const text = new DOMParser()
    .parseFromString(
      source
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/(p|div|li|h[1-6]|blockquote|pre|section|article)>/gi, ' ')
        .replace(/<[^>]+>/g, ' '),
      'text/html'
    )
    .body.textContent.trim()
  const words = text.split(/\s+/).filter(Boolean)

  return words.length > 120 ? `${words.slice(0, 120).join(' ')}…` : text
}

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
    <>
      <SEOHead page="blogs" title="Travel Blogs | Batuwa Trip" description="Read travel stories, Nepal trekking guides, and inspiration from Batuwa Trip." />
      <div className="all-blogs-page">
      <div className="all-blogs-heading">
        <BackButton onClick={() => nav('/')} />
        <div>
          <p className="all-blogs-kicker">Stories from the trail</p>
          <h1 className="public-page-heading">Travel Blogs</h1>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="all-blogs-empty">
          <p>No blogs available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="all-blogs-list">
          {blogs.map(blog => {
            const imageUrl = blog.thumb?.startsWith('http')
              ? blog.thumb
              : blog.thumb?.startsWith('/')
                ? blog.thumb
                : `/images/${blog.thumb || 'placeholder.jpg'}`
            const blogSlug = blog.slug || getBlogSlug(blog.title)
            const preview = getBlogPreview(blog)

            return (
              <Link
                key={blog.id}
                className="all-blogs-featured"
                to={`/blog/${blogSlug}`}
                aria-label={`Read ${blog.title}`}
              >
                <div className="all-blogs-featured-image">
                  <img src={imageUrl} alt={blog.title} />
                </div>
                <div className="all-blogs-featured-content">
                  <span className="all-blogs-featured-label">Travel story</span>
                  <div className="all-blogs-featured-copy">
                    <h2>{blog.title}</h2>
                    <span className="all-blogs-divider" aria-hidden="true" />
                    {preview && <p>{preview}</p>}
                    <span className="all-blogs-featured-meta">{blog.date} · {blog.author}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      </div>
    </>
  )
}
