const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth')

// User model
const User = require('../models/User')

// Login page
router.get('/login', (req, res) => res.render('login'))

// Register page
router.get('/register', (req, res) => res.render('register'))

// Get user by ID
router.get('/single/:id', async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id).select('-password')

  if (!user) return res.status(404).render('welcome')

  res.status(200).render('user', { user })
})

// Get logged in users QR code
router.get('/qr/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params

  res.status(200).render('qr', { id })
})

// Get edit profile
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id).select('-password')

  res.status(200).render('update', { user })
})

// Edit profile
// router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
//   const {
//     name,
//     email,
//     telephone,
//     website,
//     twitter,
//     instagram,
//     facebook,
//     github,
//     password,
//     password2,
//   } = req.body
//   let errors = []

//   // Check required fields
//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: 'Please fill in required fields' })
//   }

//   // Check passwords match
//   if (password !== password2) {
//     errors.push({ msg: 'Passwords do not match' })
//   }

//   // Check passwords length
//   if (password.length < 6) {
//     errors.push({ msg: 'Password should be at least 6 characters' })
//   }

//   if (errors.length > 0) {
//     res.render('update', {
//       errors,
//       name,
//       email,
//       telephone,
//       website,
//       twitter,
//       instagram,
//       facebook,
//       github,
//       password,
//       password2,
//     })
//   } else {
//     // Validation passed
//     User.findOneAndUpdate({ email: email }).then(user => {
//       if (user) {
//         // User exists
//         errors.push({ msg: 'Email is already registered' })
//         res.render('register', {
//           errors,
//           name,
//           email,
//           telephone,
//           website,
//           twitter,
//           instagram,
//           facebook,
//           github,
//           password,
//           password2,
//         })
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           telephone,
//           website,
//           twitter,
//           instagram,
//           facebook,
//           github,
//           password,
//         })

//         // Hash password
//         bcrypt.genSalt(10, (err, salt) =>
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err

//             // Set password to hashed
//             newUser.password = hash

//             // Save user
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   'success_msg',
//                   'You are now registered and can log in'
//                 )
//                 res.redirect('/users/login')
//               })
//               .catch(err => console.log(err))
//           })
//         )
//       }
//     })
//   }
// })

// Register Handle
router.post('/register', (req, res) => {
  const {
    name,
    email,
    telephone,
    website,
    twitter,
    instagram,
    facebook,
    github,
    password,
    password2,
  } = req.body
  let errors = []

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in required fields' })
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  // Check passwords length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      telephone,
      website,
      twitter,
      instagram,
      facebook,
      github,
      password,
      password2,
    })
  } else {
    // Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        // User exists
        errors.push({ msg: 'Email is already registered' })
        res.render('register', {
          errors,
          name,
          email,
          telephone,
          website,
          twitter,
          instagram,
          facebook,
          github,
          password,
          password2,
        })
      } else {
        const newUser = new User({
          name,
          email,
          telephone,
          website,
          twitter,
          instagram,
          facebook,
          github,
          password,
        })

        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err

            // Set password to hashed
            newUser.password = hash

            // Save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                )
                res.redirect('/users/login')
              })
              .catch(err => console.log(err))
          })
        )
      }
    })
  }
})

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
})

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
