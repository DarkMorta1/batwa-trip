export function getTourSlug(title) {
  return String(title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCanonicalTourSlug(tour) {
  if (!tour) return ''

  const storedSlug = typeof tour.slug === 'string' ? tour.slug.trim().toLowerCase() : ''
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(storedSlug)) return storedSlug

  return getTourSlug(tour.title)
}

export function getBlogSlug(title) {
  return getTourSlug(title)
}