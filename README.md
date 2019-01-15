# GRAPHQL-AUTH-API

[![Build Status](https://travis-ci.org/atmys/graphql-auth-api.svg?branch=master)](https://travis-ci.org/atmys/graphql-auth-api)
[![Coverage Status](https://coveralls.io/repos/github/atmys/graphql-auth-api/badge.svg?branch=master)](https://coveralls.io/github/atmys/graphql-auth-api?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/atmys/graphql-auth-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/atmys/graphql-auth-api?targetFile=package.json)
[![CodeFactor](https://www.codefactor.io/repository/github/atmys/graphql-auth-api/badge)](https://www.codefactor.io/repository/github/atmys/graphql-auth-api)


Custom GraphQL API boilerplate for my needs with:
- auth
- mailing
- error handling
- tests

It's built with [Node.js best practices](https://github.com/i0natan/nodebestpractices). Therefore it's meant to be used behind a reverse proxy.

## Getting Started

### Prerequisites

Make sure you have MongoDB up & running.

```console
$ mongod
```

```console
$ git clone https://github.com/atmys/graphql-auth-api.git
$ cd graphql-auth-api
$ npm install
$ npm start
```

Using dotenv, your folder should have a .env folder with at least a .env file for development & a .spec.env file for testing.

```
MyAPI/
  | index.js
  | ...
  | .env/
    | .env
    | .spec.env
```

You can check the expected environment variables in the config.js file.

## Running the tests

```console
// lint
$ npm run eslint

// run unit tests
$ npm run spec:unit

// run integration tests
$ npm run spec:int

// run lint, all tests & coverage
$ npm test
```

## Built With

* [Express](https://github.com/expressjs/express)
* [express-graphql](https://github.com/graphql/express-graphql)
* [JWT](https://github.com/auth0/node-jsonwebtoken)
* [Mongoose](https://github.com/Automattic/mongoose)