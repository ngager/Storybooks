const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (request, response) => {
  Story.find({status: 'public'})
    .populate('user')
    .then(stories => {
      response.render('stories/index', {stories: stories});
    });
});

router.get('/show/:id', (request, response) => {
  Story.findOne({_id: request.params.id})
    .populate('user')
    .then(story => {
      response.render('stories/show', {story: story});
    });
});

router.get('/add', ensureAuthenticated, (request, response) => {
  response.render('stories/add');
});

router.get('/edit/:id', ensureAuthenticated, (request, response) => {
  Story.findOne({_id: request.params.id})
    .then(story => {
      response.render('stories/edit', {story: story});
    });
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
  new Story(newStory)
    .save()
    .then(story => {
      response.redirect(`/stories/show/${story.id}`);
    });
});

router.put('/:id', (request, response) => {
  Story.findOne({_id: request.params.id})
    .then(story => {
      let allowComments;
      if (request.body.alllowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }
     
      story.title = request.body.title;
      story.body = request.body.storyBody;
      story.status = request.body.status;
      story.allowComments = allowComments;
      story.save()
        .then(story => {
          response.redirect('/dashboard');
        });
    });
});

router.delete('/:id', (request, response) => {
  Story.remove({_id: request.params.id})
    .then(() => {
      response.redirect('/dashboard');
    });
});

module.exports = router;