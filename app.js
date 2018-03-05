const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const keys = require('./config/keys');
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

require('./models/User');

const passport = require('passport');
require('./config/passport')(passport);

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Handlebars Middleware
app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Set global vars
app.use((request, response, next) => {
  response.locals.user = request.user || null;
  next();
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(error => console.log(error));

app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

