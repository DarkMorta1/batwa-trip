const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  message: { type: String, required: true },
  tourId: { type: String },
  approved: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Review', ReviewSchema)
