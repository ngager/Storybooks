const mongoose = require('mongoose');
const express = require('express');
const handlebars = require('express-handlebars');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 5000;
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(error => console.log(error));

const app = express();
  
require('./models/User');
require('./models/Story');
require('./config/passport')(passport);

const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');
const {truncate, stripTags} = require('./helpers/handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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
  helpers: {
    truncate: truncate,
    stripTags: stripTags
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Set Global Vars
app.use((request, response, next) => {
  response.locals.user = request.user || null;
  next();
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

