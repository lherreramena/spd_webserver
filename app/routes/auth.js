const express = require('express');
const passport = require('../google_oauth2');
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // o redirige a dashboard
  }
);

module.exports = router;
