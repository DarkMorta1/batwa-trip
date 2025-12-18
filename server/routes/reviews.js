const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const { requireAdmin } = require('./middleware')

// list reviews (supports optional ?tour=<id>&approved=true)
router.get('/', async (req, res) => {
  const q = {}
  if (req.query.tour) q.tourId = req.query.tour
  if (typeof req.query.approved !== 'undefined') q.approved = String(req.query.approved) === 'true'
  const r = await Review.find(q).sort({ createdAt: -1 })
  res.json(r)
})

// public: add review (unapproved by default). If Authorization header present, mark approved.
router.post('/', async (req, res) => {
  const body = { ...req.body }
  if (body._id === '' || body._id === null) delete body._id
  // if admin posts with auth header, set approved true
  body.approved = !!req.headers.authorization
  const review = new Review(body)
  await review.save()
  res.json(review)
})

// admin: update review (approve/unapprove or edit)
router.put('/:id', requireAdmin, async (req, res) => {
  const r = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(r)
})

// admin: delete review
router.delete('/:id', requireAdmin, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
