const express = require('express')
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Passport config
require('./config/passport')(passport)

// DB Config
const db = process.env.DB_KEY

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// register view engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Static files
app.use(express.static('public'))

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)

// Connect flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is up and running on port ${PORT}`))
