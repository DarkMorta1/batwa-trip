import { useEffect } from 'react'
import { getImageUrl } from '../utils/imageUrl'

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

function getExplicitCanonicalUrl(value) {
  if (!value) return ''

  try {
    const url = new URL(value, SITE_URL)
    if (url.origin !== SITE_URL) return ''
    if (!/^\/tour\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(url.pathname)) return ''
    return `${SITE_URL}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return ''
  }
}

function getAbsoluteImageUrl(value) {
  try {
    const url = new URL(getImageUrl(value || '/images/logo.jpg', 1200), SITE_URL)
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

function getSeoText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export default function SEOHead({
  page = 'home',
  title = 'Batuwa Trip',
  description = DEFAULT_DESCRIPTION,
  image = '/images/logo.jpg',
  noindex = false,
  canonical,
  seo
}) {
  useEffect(() => {
    let active = true
    const fallback = { title, description, image, noindex, canonical }
    const tourSeo = seo && typeof seo === 'object' ? seo : {}
    const tourMetaTitle = getSeoText(tourSeo.metaTitle)
    const tourMetaDescription = getSeoText(tourSeo.metaDescription)
    const tourOgTitle = getSeoText(tourSeo.ogTitle)
    const tourOgDescription = getSeoText(tourSeo.ogDescription)
    const tourOgImage = getSeoText(tourSeo.ogImage)
    const tourIndexing = tourSeo.indexing === 'index' || tourSeo.indexing === 'noindex'
      ? tourSeo.indexing
      : ''

    function applyMetadata(settings = {}) {
      const resolvedTitle = tourMetaTitle || getSeoText(settings.metaTitle) || fallback.title
      const resolvedDescription = tourMetaDescription ||
        getSeoText(settings.metaDescription) ||
        getSeoText(fallback.description) ||
        DEFAULT_DESCRIPTION
      const explicitCanonical = getExplicitCanonicalUrl(fallback.canonical)
      const resolvedCanonical = explicitCanonical || getCanonicalUrl(
        settings.canonicalUrl || fallback.canonical,
        window.location.pathname,
        page
      )
      const resolvedOgTitle = tourOgTitle ||
        getSeoText(settings.ogTitle) ||
        resolvedTitle
      const resolvedOgDescription = tourOgDescription ||
        getSeoText(settings.ogDescription) ||
        resolvedDescription
      const resolvedImage = getAbsoluteImageUrl(
        tourOgImage ||
        getSeoText(settings.ogImage) ||
        fallback.image
      )
      const resolvedIndexing = tourIndexing ||
        (settings.indexing === 'index' || settings.indexing === 'noindex' ? settings.indexing : '') ||
        (fallback.noindex ? 'noindex' : 'index')
      const robots = resolvedIndexing === 'noindex'
        ? 'noindex, nofollow'
        : 'index, follow'

      document.title = resolvedTitle
      upsertMeta('name', 'description', resolvedDescription)
      upsertMeta('name', 'robots', robots)
      upsertMeta('property', 'og:title', resolvedOgTitle)
      upsertMeta('property', 'og:description', resolvedOgDescription)
      upsertMeta('property', 'og:image', resolvedImage)
      upsertMeta('property', 'og:url', resolvedCanonical)
      upsertMeta('property', 'og:type', 'website')
      upsertMeta('name', 'twitter:card', 'summary_large_image')
      upsertMeta('name', 'twitter:title', resolvedOgTitle)
      upsertMeta('name', 'twitter:description', resolvedOgDescription)
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
  }, [page, title, description, image, noindex, canonical, seo])

  return null
}
