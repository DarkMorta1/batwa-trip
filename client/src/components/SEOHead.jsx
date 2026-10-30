import { useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const SITE_URL = 'https://www.batuwatrip.com'
const DEFAULT_DESCRIPTION = 'Explore Nepal with Batuwa Trip through carefully planned Himalayan treks, tours, and local adventures.'

function upsertMeta(attribute, value, content) {
  if (!content) return
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export default function SEOHead({
  page = 'home',
  title = 'Batuwa Trip',
  description = DEFAULT_DESCRIPTION,
  image = '/images/logo.jpg',
  noindex = false,
  canonical
}) {
  useEffect(() => {
    let active = true
    const fallback = { title, description, image, noindex, canonical }

    fetch(`${API}/api/seo/${page}`)
      .then(response => response.ok ? response.json() : null)
      .then(settings => {
        if (!active) return
        const resolvedTitle = settings?.metaTitle || fallback.title
        const resolvedDescription = settings?.metaDescription || fallback.description
        const resolvedImage = settings?.ogImage || fallback.image
        const resolvedCanonical = settings?.canonicalUrl || fallback.canonical || `${SITE_URL}${window.location.pathname}`
        document.title = resolvedTitle
        upsertMeta('name', 'description', resolvedDescription)
        upsertMeta('name', 'robots', settings?.indexing === 'noindex' || fallback.noindex ? 'noindex, nofollow' : 'index, follow')
        upsertMeta('property', 'og:title', settings?.ogTitle || resolvedTitle)
        upsertMeta('property', 'og:description', settings?.ogDescription || resolvedDescription)
        upsertMeta('property', 'og:image', resolvedImage)
        upsertMeta('property', 'og:url', resolvedCanonical)
        upsertMeta('property', 'og:type', 'website')
        upsertMeta('name', 'twitter:card', 'summary_large_image')
        upsertMeta('name', 'twitter:title', settings?.ogTitle || resolvedTitle)
        upsertMeta('name', 'twitter:description', settings?.ogDescription || resolvedDescription)
        upsertMeta('name', 'twitter:image', resolvedImage)
        upsertLink('canonical', resolvedCanonical)
      })
      .catch(error => {
        if (!active) return
        console.error('Failed to load SEO settings:', error)
        document.title = fallback.title
        upsertMeta('name', 'description', fallback.description)
        upsertMeta('name', 'robots', fallback.noindex ? 'noindex, nofollow' : 'index, follow')
        upsertLink('canonical', fallback.canonical || `${SITE_URL}${window.location.pathname}`)
      })

    return () => { active = false }
  }, [page, title, description, image, noindex, canonical])

  return null
}
