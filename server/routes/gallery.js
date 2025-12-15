const express = require('express')
const router = express.Router()
const Gallery = require('../models/Gallery')
const { requireAdmin } = require('./middleware')

// list gallery images
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    console.error('Error fetching gallery', err)
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
})

// admin: add a gallery item manually
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { path, caption } = req.body
    if (!path) return res.status(400).json({ error: 'path is required' })
    const g = new Gallery({ path, caption })
    await g.save()
    res.json(g)
  } catch (err) {
    console.error('Error creating gallery item', err)
    res.status(500).json({ error: 'Failed to create gallery item' })
  }
})

// admin: delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting gallery item', err)
    res.status(500).json({ error: 'Failed to delete gallery item' })
  }
})

module.exports = router
