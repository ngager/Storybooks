const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const auth = require('./routes/auth');
const app = express();
const port = process.env.PORT || 5000;

require('./models/User');

const passport = require('passport');
require('./config/passport')(passport);

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(error => console.log(error));

app.get('/', (request, response) => {
  response.send('It Works!');
});

app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

