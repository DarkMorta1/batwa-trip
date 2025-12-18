require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const blogRoutes = require('./routes/blogs')
const voucherRoutes = require('./routes/vouchers')
const tourRoutes = require('./routes/tours')
const reviewRoutes = require('./routes/reviews')
const uploadRoutes = require('./routes/upload')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// serve uploaded images from project images folder
app.use('/images', express.static(path.join(__dirname, '..', 'images')))

app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/vouchers', voucherRoutes)
app.use('/api/tours', tourRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)

const PORT = process.env.PORT || 4000

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
