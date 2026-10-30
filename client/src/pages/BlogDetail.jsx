import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { sanitizeRichText } from '../components/RichTextEditor'
import { getBlogSlug } from '../utils/tourSlug'
import SEOHead from '../components/SEOHead'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getImageUrl(path) {
  const imagePath = typeof path === 'string' ? path.trim() : ''
  return imagePath.startsWith('http')
    ? imagePath
    : imagePath.startsWith('/')
      ? imagePath
      : `/images/${imagePath || 'placeholder.jpg'}`
}

function serializeNode(node) {
  if (node.nodeType === 1) return node.outerHTML
  return String(node.textContent || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildArticleSections(content, images) {
  if (!images.length) return [{ html: content, image: null, imageRight: true }]

  const nodes = Array.from(new DOMParser().parseFromString(content || '', 'text/html').body.childNodes)
  const nodesPerSection = Math.max(1, Math.ceil(nodes.length / (images.length + 1)))
  const sections = images.map((image, index) => {
    const start = index * nodesPerSection
    const end = Math.min(start + nodesPerSection, nodes.length)
    return {
      html: nodes.slice(start, end).map(serializeNode).join(''),
      image,
      imageRight: index % 2 === 0
    }
  })
  const remainingHtml = nodes.slice(images.length * nodesPerSection).map(serializeNode).join('')
  if (remainingHtml) sections.push({ html: remainingHtml, image: null, imageRight: true })
  return sections
}

export default function BlogDetail(){
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const articleRef = React.useRef(null)

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

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

  const imageUrl = getImageUrl(blog.thumb)
  const content = sanitizeRichText(blog.content || '')
  const articleImages = Array.isArray(blog.articleImages)
    ? blog.articleImages.filter(Boolean).map(getImageUrl)
    : []
  const articleSections = buildArticleSections(content, articleImages)
  const scrollToArticle = () => articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <SEOHead page={`blog-${slug}`} title={`${blog.title} | Batuwa Trip`} description={blog.excerpt || blog.title} image={blog.thumb} />
      <div className="subpage-page blog-detail-page">
        <article className="blog-detail">
          <header
            className="blog-detail-page__hero"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          >
            <div className="blog-detail-page__hero-overlay">
              <span className="blog-detail-page__eyebrow">Travel story</span>
              <h1>{blog.title}</h1>
              {blog.excerpt && <p>{blog.excerpt}</p>}
              <button type="button" className="blog-detail-page__read-more" onClick={scrollToArticle}>
                Read More
              </button>
              <div className="blog-detail-page__meta">
                {blog.date && <span>{blog.date}</span>}
                {blog.date && blog.author && <span aria-hidden="true">·</span>}
                {blog.author && <span>By {blog.author}</span>}
              </div>
            </div>
          </header>

          <div ref={articleRef} className="blog-detail-page__article">
            {articleSections.map((section, index) => (
              <section
                key={`${section.image || 'text'}-${index}`}
                className={`blog-detail-page__section ${section.imageRight ? 'blog-detail-page__section--image-right' : 'blog-detail-page__section--image-left'}`}
              >
                <div className="blog-detail-page__section-copy blog-text rich-text-content" dangerouslySetInnerHTML={{ __html: section.html }} />
                {section.image && (
                  <img
                    className="blog-detail-page__article-image"
                    src={section.image}
                    alt={`${blog.title} article image ${index + 1}`}
                  />
                )}
              </section>
            ))}
          </div>
        </article>
      </div>
    </>
  )
}
