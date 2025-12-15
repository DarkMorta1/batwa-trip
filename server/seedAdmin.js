require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Admin = require('./models/Admin')

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGO_URI)

  const username = 'admin'
  const password = 'B@twaTr@vels_20/05_pass'

  const existing = await Admin.findOne({ username })
  if (existing) {
    console.log('Admin already exists')
    process.exit(0)
  }

  const hash = await bcrypt.hash(password, 10)
  const admin = new Admin({ username, passwordHash: hash })
  await admin.save()
  console.log('Admin user created')
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
