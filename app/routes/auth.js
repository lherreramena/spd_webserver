const express = require('express');
const passport = require('../google_oauth2');
const router = express.Router();
const path = require('path');

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/authenticated'); // o redirige a dashboard
  }
);

router.get('/authenticated', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  //console.log('req.user: ', JSON.stringify(req.user))
  //console.log(JSON.stringify(req))
  //res.render('dashboard', { user: req.user });
  // Send the dashboard.html file as a response
  const dashboardPath = path.join(__dirname, '../public', 'dashboard.html');
  res.sendFile(dashboardPath);
});


module.exports = router;
