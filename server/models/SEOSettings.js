const mongoose = require('mongoose')

const SEOSettingsSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: [String], default: [] },
  focusKeyword: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  customSlug: { type: String, default: '' },
  indexing: { type: String, enum: ['index', 'noindex'], default: 'index' }
}, { timestamps: true })

module.exports = mongoose.model('SEOSettings', SEOSettingsSchema)
