const express = require('express')
const router = express.Router()
const Tour = require('../models/Tour')
const { requireAdmin } = require('./middleware')

// list tours (public)
router.get('/', async (req, res) => {
  const tours = await Tour.find()
  res.json(tours)
})

// create tour (admin)
router.post('/', requireAdmin, async (req, res) => {
  const body = { ...req.body }
  if (body._id === '' || body._id === null) delete body._id
  const t = new Tour(body)
  await t.save()
  res.json(t)
})

// update
router.put('/:id', requireAdmin, async (req, res) => {
  const t = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(t)
})

// delete
router.delete('/:id', requireAdmin, async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
