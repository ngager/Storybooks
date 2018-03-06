const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (request, response) => {
  response.render('stories/index');
});

router.get('/add', ensureAuthenticated, (request, response) => {
  response.render('stories/add');
});

router.post('/', ensureAuthenticated, (request, response) => {
  let allowComments;
  if (request.body.alllowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: request.body.title,
    body: request.body.storyBody,
    status: request.body.status,
    allowComments: allowComments,
    user: request.user.id 
  }

  // Create Story
  new StorySchema(newStory)
    .save()
    .then(story => {
      response.redirect(`/stories/show/${story.id}`);
    });
});

module.exports = router;