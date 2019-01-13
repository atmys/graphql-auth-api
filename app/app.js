const express = require('express');
const jwt = require("jsonwebtoken");
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { JWTSecret, production } = require('../config');
const { User } = require('./shared/models');
const { shouldExist, handleError } = require('./shared/error');

const usersAPI = require('./users/users.api');

const app = express();

// CONFIG
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json());

/* istanbul ignore if */
if (production) {
  // FOR DOCKERIZED APP
  app.enable('trust proxy');
} else {
  // LOG EVERYTHING
  app.use(morgan('dev'));
}


// AUTH
app.use(async (req, res, next) => {
  try {
    if (!req.headers || !req.headers.jwtauth) {
      req.user = undefined;
      return next();
    }
    const decode = jwt.verify(req.headers.jwtauth, JWTSecret);
    // FOR MAX SECURITY, RETRIEVE USER DATA ON EACH REQUEST. MIGHT IMPACT PERF.
    const user = await User.findById(decode._id);
    shouldExist(user);
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
});

// APIS
app.use('/api/users', usersAPI);

// ERROR HANDLING
app.use((err, req, res, next) => {
  handleError(err, req);
  res.sendStatus(err.code || 500);
  next(err);
});

module.exports = app;