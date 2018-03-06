const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


router.get('/', ensureGuest, (request, response) => {
  response.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (request, response) => {
  response.render('index/dashboard');
});

router.get('/about', (request, response) => {
  response.render('index/about');
});

module.exports = router;