const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


router.get('/', ensureGuest, (request, response) => {
  response.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (request, response) => {
  Story.find({user: request.user.id })
    .then(stories => {
      response.render('index/dashboard', {stories: stories});
    });
});

router.get('/about', (request, response) => {
  response.render('index/about');
});

module.exports = router;