const { buildSchema } = require('graphql');
const typeDefs = require('./typeDefs');

module.exports = buildSchema(typeDefs);