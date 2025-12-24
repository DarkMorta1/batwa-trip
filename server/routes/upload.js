const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Gallery = require('../models/Gallery')
const { requireAdmin } = require('./middleware')

// store in project images folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'images')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })

// POST /api/upload - admin only
router.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' })
  // return public path relative to project root so frontend can use /images/filename
  const publicPath = `/images/${req.file.filename}`
  
  // Save to gallery collection
  const galleryItem = new Gallery({ path: publicPath, caption: req.file.originalname })
  await galleryItem.save()
  
  res.json({ path: publicPath })
})

module.exports = router
