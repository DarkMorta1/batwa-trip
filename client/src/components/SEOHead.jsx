import { useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const SITE_URL = 'https://www.batuwatrip.com'
const DEFAULT_DESCRIPTION = 'Explore Nepal with Batuwa Trip through carefully planned Himalayan treks, tours, and local adventures.'
const TRIP_PATHS = ['/trips/all', '/trips/upcoming', '/trips/available']

function getCanonicalUrl(value, pathname, page) {
  const fallback = `${SITE_URL}${pathname}`
  if (!value) return fallback

  try {
    const url = new URL(value, SITE_URL)
    if (url.origin !== SITE_URL) return fallback
    const allowedPaths = page === 'trips' ? TRIP_PATHS : [pathname]
    if (!allowedPaths.includes(url.pathname)) return fallback
    return `${SITE_URL}${url.pathname}`
  } catch {
    return fallback
  }
}

function getAbsoluteImageUrl(value) {
  try {
    const url = new URL(value || '/images/logo.jpg', SITE_URL)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : `${SITE_URL}/images/logo.jpg`
  } catch {
    return `${SITE_URL}/images/logo.jpg`
  }
}

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

    function applyMetadata(settings = {}) {
      const resolvedTitle = settings.metaTitle || fallback.title
      const resolvedDescription = settings.metaDescription || fallback.description
      const resolvedCanonical = getCanonicalUrl(
        settings.canonicalUrl || fallback.canonical,
        window.location.pathname,
        page
      )
      const resolvedImage = getAbsoluteImageUrl(settings.ogImage || fallback.image)
      const robots = settings.indexing === 'noindex' || fallback.noindex
        ? 'noindex, nofollow'
        : 'index, follow'

      document.title = resolvedTitle
      upsertMeta('name', 'description', resolvedDescription)
      upsertMeta('name', 'robots', robots)
      upsertMeta('property', 'og:title', settings.ogTitle || resolvedTitle)
      upsertMeta('property', 'og:description', settings.ogDescription || resolvedDescription)
      upsertMeta('property', 'og:image', resolvedImage)
      upsertMeta('property', 'og:url', resolvedCanonical)
      upsertMeta('property', 'og:type', 'website')
      upsertMeta('name', 'twitter:card', 'summary_large_image')
      upsertMeta('name', 'twitter:title', settings.ogTitle || resolvedTitle)
      upsertMeta('name', 'twitter:description', settings.ogDescription || resolvedDescription)
      upsertMeta('name', 'twitter:image', resolvedImage)
      upsertLink('canonical', resolvedCanonical)
    }

    fetch(`${API}/api/seo/${page}`)
      .then(response => response.ok ? response.json() : null)
      .then(settings => {
        if (!active) return
        applyMetadata(settings || {})
      })
      .catch(error => {
        if (!active) return
        console.error('Failed to load SEO settings:', error)
        applyMetadata()
      })

    return () => { active = false }
  }, [page, title, description, image, noindex, canonical])

  return null
}
