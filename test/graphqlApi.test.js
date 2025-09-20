const request = require('supertest');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../src/graphql/schema');
const resolvers = require('../src/graphql/resolvers');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function getToken() {
  return jwt.sign({ id: 1, username: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('GraphQL API', () => {
  let app, server, httpServer;
  before(async () => {
    app = express();
    app.use(express.json());
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        if (req.body && req.body.query &&
          (req.body.query.includes('mutation') &&
            (req.body.query.includes('register') || req.body.query.includes('login')))) {
          return {};
        }
        const auth = req.headers['authorization'];
        if (!auth) throw new Error('No token');
        try {
          const user = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
          return { user };
        } catch {
          throw new Error('Invalid token');
        }
      },
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    httpServer = app.listen(0);
  });
  after(() => httpServer && httpServer.close());

  it('should register a new user', (done) => {
    request(app)
      .post('/graphql')
      .send({
        query: 'mutation { register(name: "TestUser", email: "testuser@email.com", password: "testpass") { token user { id name email } } }'
      })
      .expect(200)
      .expect(res => {
        if (!res.body.data.register.token) throw new Error('No token');
        if (res.body.data.register.user.email !== 'testuser@email.com') throw new Error('Wrong email');
      })
      .end(done);
  });

  it('should login with registered user', (done) => {
    request(app)
      .post('/graphql')
      .send({
        query: 'mutation { login(email: "testuser@email.com", password: "testpass") { token user { id name email } } }'
      })
      .expect(200)
      .expect(res => {
        if (!res.body.data.login.token) throw new Error('No token');
        if (res.body.data.login.user.email !== 'testuser@email.com') throw new Error('Wrong email');
      })
      .end(done);
  });

  it('should list books with valid token', (done) => {
    // First login to get token
    request(app)
      .post('/graphql')
      .send({
        query: 'mutation { login(email: "testuser@email.com", password: "testpass") { token } }'
      })
      .expect(200)
      .then(res => {
        const token = res.body.data.login.token;
        request(app)
          .post('/graphql')
          .set('Authorization', 'Bearer ' + token)
          .send({ query: '{ books { id title author } }' })
          .expect(200)
          .expect(res2 => {
            if (!res2.body.data.books) throw new Error('No books');
          })
          .end(done);
      });
  });

  it('should create book with valid token', (done) => {
    request(app)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + getToken())
      .send({ query: 'mutation { createBook(title: "GraphQL Test", author: "GraphQL") { id title author } }' })
      .expect(200)
      .expect(res => {
        if (res.body.data.createBook.title !== 'GraphQL Test') throw new Error('Wrong title');
      })
      .end(done);
  });
});
