const express = require('express')
const colors = require('colors')
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const connectDB = require('./config/database')

const app = express()

// Passport config
require('./config/passport')(passport)

// Connect to MongoDB
connectDB()

// register view engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Static files
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: false }))

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

app.listen(PORT, console.log(`Server is running on port ${PORT}`.yellow.bold))
