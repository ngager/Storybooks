const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (request, response) => {
  Story.find({status: 'public'})
    .populate('user')
    .sort({date: 'desc'})
    .then(stories => {
      response.render('stories/index', {stories: stories});
    });
});

router.get('/show/:id', (request, response) => {
  Story.findOne({_id: request.params.id})
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status == 'public') {
        response.render('stories/show', {story: story});
      } else {
        if (request.user) {
          if (request.user.id == story.user._id) {
            response.render('stories/show', {story: story});
          } else {
            response.redirect('/stories');
          }
        } else {
          response.redirect('/stories');
        }
      }
    });
});

router.get('/user/:userId', (request, response) => {
  Story.find({user: request.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
      response.render('stories/index', {stories: stories});
    });
});

router.get('/my', ensureAuthenticated, (request, response) => {
  Story.find({user: request.user.id})
    .populate('user')
    .then(stories => {
      response.render('stories/index', {stories: stories});
    });
});

router.get('/add', ensureAuthenticated, (request, response) => {
  response.render('stories/add');
});

// TODO: Cannot modify allowComments
router.get('/edit/:id', ensureAuthenticated, (request, response) => {
  Story.findOne({_id: request.params.id})
    .then(story => {
      if (story.user != request.user.id) {
        response.redirect('/stories');
      } else {
        response.render('stories/edit', {story: story});
      }
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

router.post('/comment/:id', (request, response) => {
  Story.findOne({_id: request.params.id})
    .then(story => {
      const newComment = {
        commentBody: request.body.commentBody,
        commentUser: request.user.id
      }

      story.comments.unshift(newComment);
      story.save()
        .then(story => {
          response.redirect(`/stories/show/${story.id}`);
        });
    });
});

module.exports = router;