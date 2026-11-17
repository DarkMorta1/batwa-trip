const express = require('express')
const router = express.Router()
const SEOSettings = require('../models/SEOSettings')

router.get('/', async (req, res) => {
  try {
    const settings = await SEOSettings.find()
      .select('page canonicalUrl indexing -_id')
      .lean()
    res.json(settings)
  } catch (error) {
    console.error('Get public SEO settings error:', error)
    res.status(500).json({ message: 'Error fetching SEO settings' })
  }
})

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
