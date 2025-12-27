const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Gallery = require('../models/Gallery')
const { requireAdmin } = require('./middleware')

// store in client/public/images folder
const imagesPath = path.join(__dirname, '..', '..', 'client', 'public', 'images')

// Ensure images directory exists
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath)
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// POST /api/upload - admin only
router.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    
    // return public path relative to project root so frontend can use /images/filename
    const publicPath = `/images/${req.file.filename}`
    
    // Save to gallery collection
    const galleryItem = new Gallery({ path: publicPath, caption: req.file.originalname })
    await galleryItem.save()
    
    res.json({ path: publicPath })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: error.message || 'Upload failed' })
  }
})

module.exports = router
