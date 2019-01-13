# GQL-AUTH-API

Custom GraphQL API boilerplate for my needs with:
- auth
- mailing
- error handling
- tests

It's built with [Node.js best practices](https://github.com/i0natan/nodebestpractices). Therefore it's meant to be used behind a reverse proxy.

## Getting Started

### Prerequisites

Make sure you have MongoDB & Jasmine installed.

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

Make sure you have MongoDB running.

```
// lint
npm run eslint

// run unit tests
npm run spec:unit

// run integration tests
npm run spec:int

// run lint, all tests & coverage
npm test
```

## Built With

* [Express](https://github.com/expressjs/express)
* [express-graphql](https://github.com/graphql/express-graphql)
* [JWT](https://github.com/auth0/node-jsonwebtoken)
* [Mongoose](https://github.com/Automattic/mongoose)