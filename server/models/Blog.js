const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  thumb: String,
  date: String,
  author: String,
  content: String
}, { timestamps: true })

module.exports = mongoose.model('Blog', BlogSchema)
