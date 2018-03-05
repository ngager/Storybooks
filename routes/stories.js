const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('stories/index');
});

router.get('/add', (request, response) => {
  response.render('stories/add');
});

module.exports = router;