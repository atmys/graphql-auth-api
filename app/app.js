const express = require('express');
const graphqlHTTP = require('express-graphql');
const jwt = require("jsonwebtoken");
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { JWTSecret, production } = require('../config');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { User } = require('./shared/models');
const { shouldExist, handleError } = require('./shared/error');

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
    const decoded = jwt.verify(req.headers.jwtauth, JWTSecret);
    // FOR MAX SECURITY, RETRIEVE USER DATA ON EACH REQUEST. MIGHT IMPACT PERF.
    const user = await User.findById(decoded.id);
    shouldExist(user);
    req.user = user;
    return next();
  } catch (err) {
    err.code = err.code || 500;
    handleError(err, req);
    res.status(err.code).send({ error: err });
  }
});

// API

app.use('/graphql', graphqlHTTP((req, res, graphQLParams) => ({
  schema: schema,
  rootValue: resolvers,
  graphiql: !production,
  context: { user: req.user, graphQLParams },
  formatError(err) {
    handleError(err, req);
    return {
      message: err.message,
      code: err.originalError && err.originalError.code,
      locations: err.locations,
      path: err.path
    };
  }
})));

module.exports = app;