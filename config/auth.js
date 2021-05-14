module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error_msg', 'You need to be logged in to view that page')
    res.redirect('/users/login')
  },
}
