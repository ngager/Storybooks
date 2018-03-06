const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (request, response) => {
  response.render('stories/index');
});

router.get('/add', ensureAuthenticated, (request, response) => {
  response.render('stories/add');
});

module.exports = router;