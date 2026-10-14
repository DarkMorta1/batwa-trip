const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

// Express middleware to protect admin routes. Verifies JWT token.
async function requireAdmin(req, res, next) {
 const auth = req.headers.authorization
 if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })

 const token = auth.split(' ')[1]
 try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   const admin = await Admin.findById(decoded.id).select('-passwordHash')
   if (!admin || !admin.isActive) {
     return res.status(401).json({ message: 'Unauthorized' })
   }

   req.admin = admin
   next()
 } catch (err) {
   return res.status(401).json({ message: 'Invalid or expired token' })
 }
}

function requireRole(...roles) {
 return (req, res, next) => {
   if (!req.admin || !roles.includes(req.admin.role)) {
     return res.status(403).json({ message: 'Forbidden' })
   }
   next()
 }
}

module.exports = { requireAdmin, requireRole }
