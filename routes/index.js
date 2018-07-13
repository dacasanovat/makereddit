const express = require('express');
const User = require('../models/user');

const router = express.Router();

// set layout variables
router.use((req, res, next) => {
  res.locals.title = 'MakeReddit';
  res.locals.currentUserId = req.session.userId;
  next();
});

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});

// login
router.get('/login', (req, res) => {
  res.render('login');
});


// action of POST related to the "form" and button submit in the login.hbs
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const nextError = new Error('Username or password incorrect');
      nextError.status = 401;

      return next(nextError);
    }
    /* eslint-disable-next-line no-underscore-dangle */
    req.session.userId = user._id; // porque tiene un _?

    return res.redirect('/');
  });
});

// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
      return next();
    });
  }

  return res.redirect('/login');
});

module.exports = router;
