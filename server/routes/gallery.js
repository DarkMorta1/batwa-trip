const express = require('express')
const router = express.Router()
const Gallery = require('../models/Gallery')
const { requireAdmin } = require('./middleware')

// List gallery items (admin only)
router.get('/', requireAdmin, async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 })
  res.json(items)
})

// Delete gallery item (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router

