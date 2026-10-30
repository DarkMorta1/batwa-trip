const express = require('express')
const router = express.Router()
const SEOSettings = require('../models/SEOSettings')

router.get('/:page', async (req, res) => {
  try {
    const settings = await SEOSettings.findOne({ page: req.params.page }).select('-__v')
    res.json(settings || {})
  } catch (error) {
    console.error('Get public SEO setting error:', error)
    res.status(500).json({ message: 'Error fetching SEO setting' })
  }
})

module.exports = router
