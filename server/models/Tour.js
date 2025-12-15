const mongoose = require('mongoose')

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  days: { type: Number, required: true, default: 1 },
  location: { type: String, required: true },
  trending: { type: Boolean, default: false },
  upcoming: { type: Boolean, default: false },
  photos: { type: [String], default: [] },
  details: {
    expenses: { type: String, default: '' },
    itinerary: { type: [String], default: [] }
  }
}, { timestamps: true })

module.exports = mongoose.model('Tour', TourSchema)
