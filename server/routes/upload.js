const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

// store uploads in the shared client/public/images folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'client', 'public', 'images')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })
const Gallery = require('../models/Gallery')

// POST /api/upload - admin only ideally, but we'll allow multipart with token in header (middleware can be added)
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' })
  // return public path relative to project root so frontend can use /images/filename
  const publicPath = `/images/${req.file.filename}`
  try{
    // save to gallery for frontend listing
    const g = new Gallery({ path: publicPath })
    await g.save()
  }catch(err){
    console.error('Failed to save gallery item', err)
  }
  res.json({ path: publicPath })
})

module.exports = router
