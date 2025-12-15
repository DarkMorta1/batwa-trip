const mongoose = require('mongoose')

const VoucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Voucher', VoucherSchema)
