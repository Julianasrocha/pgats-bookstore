const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const bodyParser = require('body-parser');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const userService = require('../services/userService');

const app = express();

app.use(bodyParser.json());

const { ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    // Allow unauthenticated access for register and login mutations
    if (req.body && req.body.query &&
      (req.body.query.includes('mutation') &&
        (req.body.query.includes('register') || req.body.query.includes('login')))) {
      return {};
    }
    const auth = req.headers['authorization'];
    if (!auth) {
      const { GraphQLError } = require('graphql');
      throw new GraphQLError('No token', {
        extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } }
      });
    }
    const token = auth.replace('Bearer ', '');
    const user = userService.verifyToken(token);
    if (!user) {
      if (res) res.statusCode = 401;
      const err = new Error('Invalid token');
      err.statusCode = 401;
      throw err;
    }
    return { user };
  },
  formatError: (err) => {
    if (err.originalError && err.originalError.statusCode) {
      err.extensions.code = err.originalError.statusCode === 400 ? 'BAD_USER_INPUT' : 'UNAUTHENTICATED';
      err.extensions.http = { status: err.originalError.statusCode };
    }
    return err;
  },
  plugins: [ApolloServerPluginLandingPageDisabled()],
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

startApollo();

module.exports = app;
