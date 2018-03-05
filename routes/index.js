const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('index/welcome');
});

router.get('/dashboard', (request, response) => {
  response.render('index/dashboard');
});

router.get('/about', (request, response) => {
  response.render('index/about');
});

module.exports = router;