const express = require('express')
const router = express.Router()
const Voucher = require('../models/Voucher')
const { requireAdmin } = require('./middleware')

// List vouchers (admin)
router.get('/', requireAdmin, async (req, res) => {
  const vouchers = await Voucher.find().sort({ createdAt: -1 })
  res.json(vouchers)
})

// Create voucher (admin)
router.post('/', requireAdmin, async (req, res) => {
  const body = { ...req.body }
  if (body._id === '' || body._id === null) delete body._id
  const v = new Voucher(body)
  await v.save()
  res.json(v)
})

// Update voucher
router.put('/:id', requireAdmin, async (req, res) => {
  const v = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(v)
})

// Delete voucher
router.delete('/:id', requireAdmin, async (req, res) => {
  await Voucher.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

// Public: validate voucher code
router.post('/validate', async (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ message: 'Missing code' })

  const v = await Voucher.findOne({ code: code.toUpperCase() })
  if (!v) return res.status(404).json({ valid: false, message: 'Invalid voucher' })
  if (!v.active) return res.status(400).json({ valid: false, message: 'Voucher is inactive' })

  res.json({ valid: true, discountPercent: v.discountPercent })
})

module.exports = router
