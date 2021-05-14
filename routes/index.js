const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

// User model
const User = require('../models/User')

// Welcome Page
router.get('/', (req, res) => res.render('welcome'))

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ email: req.user.email })

  res.render('dashboard', {
    name: req.user.name,
    id: req.user._id,
  })
})

module.exports = router
