const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const { requireAdmin } = require('./middleware')

// Public: list blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 })
  res.json(blogs)
})

// Admin: create blog
router.post('/', requireAdmin, async (req, res) => {
  const data = { ...req.body }
  if (data._id === '' || data._id === null) delete data._id
  const blog = new Blog(data)
  await blog.save()
  res.json(blog)
})

// Admin: edit
router.put('/:id', requireAdmin, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(blog)
})

// Admin: delete
router.delete('/:id', requireAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router
