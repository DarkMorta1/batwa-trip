const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const { requireAdmin } = require('./middleware')

// list reviews (supports optional ?tour=<id>&approved=true)
router.get('/', async (req, res) => {
  try {
    const q = {}
    if (req.query.tour) q.tourId = req.query.tour
    if (typeof req.query.approved !== 'undefined') q.approved = String(req.query.approved) === 'true'
    const r = await Review.find(q).sort({ createdAt: -1 })
    res.json(r)
  } catch (err) {
    console.error('Error fetching reviews', err)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

// public: add review (unapproved by default). If Authorization header present, mark approved.
router.post('/', async (req, res) => {
  try {
    const body = { ...req.body }
    if (body._id === '' || body._id === null) delete body._id
    // basic validation
    if (!body.author || !body.message) {
      return res.status(400).json({ error: 'author and message are required' })
    }
    // if admin posts with auth header, set approved true
    body.approved = !!req.headers.authorization
    const review = new Review(body)
    await review.save()
    res.json(review)
  } catch (err) {
    console.error('Error creating review', err)
    res.status(500).json({ error: 'Failed to create review', details: err.message })
  }
})

// admin: update review (approve/unapprove or edit)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const r = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(r)
  } catch (err) {
    console.error('Error updating review', err)
    res.status(500).json({ error: 'Failed to update review' })
  }
})

// admin: delete review
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting review', err)
    res.status(500).json({ error: 'Failed to delete review' })
  }
})

module.exports = router
