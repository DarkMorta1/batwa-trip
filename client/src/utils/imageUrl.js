const CLOUDINARY_HOST = /(^|\.)cloudinary\.com$/i
const IMAGE_TRANSFORM_KEYS = ['f', 'q']
const TRANSFORMATION_PREFIX = /^(?:a|ar|b|bo|c|d|dn|e|fl|fn|g|h|if|l|o|p|q|r|s|t|u|w|x|y|z|ac|af|br|cs|dpr|f|pg|so|sp|vc|vs|du|fps|ki|pr)_/i

function isTransformationSegment(segment) {
  return segment.split(',').some(token => TRANSFORMATION_PREFIX.test(token))
}

function replaceTransformValue(segment, key, value) {
  const tokens = segment.split(',').filter(token => !token.toLowerCase().startsWith(`${key}_`))
  tokens.push(`${key}_${value}`)
  return tokens.join(',')
}

export function optimizeCloudinaryImage(value, width) {
  if (typeof value !== 'string' || !Number.isFinite(width) || width <= 0) return value

  let url
  try {
    url = new URL(value)
  } catch {
    return value
  }

  if (!CLOUDINARY_HOST.test(url.hostname)) return value

  const parts = url.pathname.split('/')
  const isSigned = parts.some(part => /^s--.+--$/i.test(part)) ||
    url.searchParams.has('__cld_token__') ||
    url.searchParams.has('auth_token')
  if (isSigned) return value

  const uploadIndex = parts.findIndex((part, index) => part === 'upload' && parts[index - 1] === 'image')
  if (uploadIndex < 0) return value

  const versionIndex = parts.findIndex((part, index) => index > uploadIndex && /^v\d+$/.test(part))
  let transformEnd = versionIndex

  if (transformEnd < 0) {
    transformEnd = uploadIndex + 1
    while (transformEnd < parts.length && isTransformationSegment(parts[transformEnd])) {
      transformEnd += 1
    }
  }

  const transformIndexes = []
  for (let index = uploadIndex + 1; index < transformEnd; index += 1) {
    transformIndexes.push(index)
  }

  const existingCrop = transformIndexes.some(index =>
    parts[index].split(',').some(token => token.toLowerCase().startsWith('c_'))
  )

  if (!transformIndexes.length) {
    parts.splice(uploadIndex + 1, 0, `f_auto,q_auto,w_${Math.round(width)},c_limit`)
  } else {
    const transforms = transformIndexes
      .map(index => parts[index]
        .split(',')
        .filter(token => !IMAGE_TRANSFORM_KEYS.some(key => token.toLowerCase().startsWith(`${key}_`)))
        .join(','))
      .filter(Boolean)
    const finalTransform = transforms.pop() || ''
    let optimizedFinalTransform = replaceTransformValue(finalTransform, 'f', 'auto')
    optimizedFinalTransform = replaceTransformValue(optimizedFinalTransform, 'q', 'auto')
    optimizedFinalTransform = replaceTransformValue(optimizedFinalTransform, 'w', Math.round(width))
    if (!existingCrop) optimizedFinalTransform += ',c_limit'
    transforms.push(optimizedFinalTransform)
    parts.splice(uploadIndex + 1, transformEnd - uploadIndex - 1, ...transforms)
  }

  url.pathname = parts.join('/')
  return url.href
}

export function getImageUrl(value, width) {
  if (typeof value !== 'string' || !value.trim()) return ''

  const source = value.trim()
  const resolved = /^https?:\/\//i.test(source) || source.startsWith('/') || /^(data:|blob:)/i.test(source)
    ? source
    : `/images/${source}`

  return optimizeCloudinaryImage(resolved, width)
}
