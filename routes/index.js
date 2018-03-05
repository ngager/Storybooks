const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('index/welcome');
});

router.get('/dashboard', (request, response) => {
  response.send('Dashboard');
});

module.exports = router;