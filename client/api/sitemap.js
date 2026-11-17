const SITE_URL = 'https://www.batuwatrip.com'
const SITE_ORIGIN = new URL(SITE_URL).origin
const API_FETCH_TIMEOUT_MS = 5000
const TRIP_PATHS = ['/trips/all', '/trips/upcoming', '/trips/available']

function slugify(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function sitemapPath(pathname, page, canonicalUrl, knownPaths) {
  if (!canonicalUrl) return pathname

  try {
    const url = new URL(canonicalUrl, SITE_URL)
    const allowedPaths = page === 'trips' ? TRIP_PATHS : [pathname]
    if (url.origin !== SITE_ORIGIN || !allowedPaths.includes(url.pathname) || !knownPaths.has(url.pathname)) {
      return pathname
    }
    return url.pathname
  } catch {
    return pathname
  }
}

function buildSitemap(tours, blogs, seoSettings) {
  const candidates = [
    { path: '/', page: 'home' },
    { path: '/trips/all', page: 'trips' },
    { path: '/trips/upcoming', page: 'trips' },
    { path: '/trips/available', page: 'trips' },
    { path: '/blogs', page: 'blogs' },
    { path: '/gallery', page: 'gallery' },
    { path: '/about', page: 'about' }
  ]

  for (const tour of tours) {
    const slug = slugify(tour.title)
    if (tour.status === 'published' && slug) {
      candidates.push({ path: `/tour/${slug}`, page: `tour-${slug}` })
    }
  }

  for (const blog of blogs) {
    if (blog.status && blog.status !== 'published') continue
    const slug = blog.slug || slugify(blog.title)
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      candidates.push({ path: `/blog/${slug}`, page: `blog-${slug}` })
    }
  }

  const knownPaths = new Set(candidates.map(candidate => candidate.path))
  const settingsByPage = new Map(
    seoSettings.map(setting => [setting.page, setting])
  )
  const includedPaths = new Set()
  const urls = []

  for (const candidate of candidates) {
    const settings = settingsByPage.get(candidate.page)
    if (settings?.indexing === 'noindex') continue

    const path = sitemapPath(candidate.path, candidate.page, settings?.canonicalUrl, knownPaths)
    if (!path || includedPaths.has(path)) continue

    includedPaths.add(path)
    urls.push(`${SITE_URL}${path}`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(url => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join('\n')}\n</urlset>\n`
}

async function fetchArray(url, isValidItem) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Request to ${url} failed with status ${response.status}`)
    }

    const data = await response.json()
    if (!Array.isArray(data) || !data.every(isValidItem)) {
      throw new Error(`Request to ${url} returned an invalid list`)
    }
    return data
  } finally {
    clearTimeout(timeout)
  }
}

module.exports = async function sitemapHandler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).send('Method not allowed')
  }

  const apiUrl = (process.env.VITE_API_URL || process.env.API_URL || '').replace(/\/+$/, '')
  if (!apiUrl) {
    console.error('Sitemap generation requires API_URL or VITE_API_URL')
    return res.status(503).send('Sitemap is temporarily unavailable')
  }

  try {
    const [tours, blogs, seoSettings] = await Promise.all([
      fetchArray(
        `${apiUrl}/api/tours?status=published`,
        tour => tour && typeof tour === 'object' && typeof tour.title === 'string' && tour.status === 'published'
      ),
      fetchArray(
        `${apiUrl}/api/blogs`,
        blog => blog && typeof blog === 'object' && typeof blog.title === 'string' &&
          (blog.slug == null || typeof blog.slug === 'string')
      ),
      fetchArray(
        `${apiUrl}/api/seo`,
        setting => setting && typeof setting === 'object' && typeof setting.page === 'string' &&
          (setting.canonicalUrl == null || typeof setting.canonicalUrl === 'string') &&
          (setting.indexing == null || ['index', 'noindex'].includes(setting.indexing))
      )
    ])
    const xml = buildSitemap(tours, blogs, seoSettings)

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    if (req.method === 'HEAD') return res.status(200).end()
    return res.status(200).send(xml)
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return res.status(502).send('Sitemap is temporarily unavailable')
  }
}

module.exports.buildSitemap = buildSitemap
