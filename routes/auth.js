const express =  require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { 
  failureRedirect: '/' }), (request, response) => {
    response.redirect('/dashboard');
  });

router.get('/verify', (request, response) => {
  if (request.user) {
    console.log(request.user);
  } else {
    console.log('Not auth');
  }
});

router.get('/logout', (request, response) => {
    console.log('logout');
    request.logout();
    response.redirect('/');
});

module.exports = router;