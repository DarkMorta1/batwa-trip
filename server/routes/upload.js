const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

// store in project images folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'images')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })

// POST /api/upload - admin only ideally, but we'll allow multipart with token in header (middleware can be added)
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' })
  // return public path relative to project root so frontend can use /images/filename
  const publicPath = `/images/${req.file.filename}`
  res.json({ path: publicPath })
})

module.exports = router
