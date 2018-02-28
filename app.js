const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();
const auth = require('./routes/auth');
const port = process.env.PORT || 5000;

require('./config/passport')(passport);

app.get('/', (request, response) => {
  response.send('It Works!');
});

app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

