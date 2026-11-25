
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../cloudinary')
const Gallery = require('../models/Gallery')
const { requireAdmin } = require('./middleware')

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: process.env.CLOUDINARY_FOLDER || 'batwa-trip',
    resource_type: 'image',
    format: undefined
  })
})

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg'
  ]

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
})

// Structured error logging
function logUploadError(error) {
  console.error('========== IMAGE UPLOAD ERROR ==========')
  console.error(JSON.stringify({
    name: error?.name,
    message: error?.message,
    http_code: error?.http_code,
    code: error?.code,
    cloudinaryError: error?.error?.message,
    stack: error?.stack,
    details: error && typeof error === 'object'
      ? Object.keys(error)
      : []
  }, null, 2))
  console.error('========================================')
}

// POST /api/upload - Admin only
router.post('/', requireAdmin, (req, res) => {

  // Handle Multer and Cloudinary upload errors explicitly
  upload.single('file')(req, res, async (uploadError) => {

    if (uploadError) {
      logUploadError(uploadError)

      return res.status(500).json({
        message: 'Image upload failed',
        error: uploadError.message || 'Unknown upload error'
      })
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded'
        })
      }

      const publicPath =
        req.file.path ||
        req.file.secure_url ||
        req.file.url

      if (!publicPath) {
        throw new Error('Cloudinary did not return an image URL')
      }

      const galleryItem = new Gallery({
        path: publicPath,
        caption: req.file.originalname
      })

      await galleryItem.save()

      return res.json({
        path: publicPath
      })

    } catch (error) {
      logUploadError(error)

      return res.status(500).json({
        message: 'Failed to save uploaded image',
        error: error.message || 'Unknown server error'
      })
    }
  })
})

module.exports = router
