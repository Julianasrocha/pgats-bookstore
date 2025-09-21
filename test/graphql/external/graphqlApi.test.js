const req = require('supertest');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude);

require('dotenv').config();

let token;

// Fixtures
const loginUser = {
  query: 'mutation { login(email: "testuser@email.com", password: "testpass") { token user { id name email } } }'
};
const registerUser = {
  query: 'mutation { register(name: "TestUser", email: "testuser@email.com", password: "testpass") { token user { id name email } } }'
};
const createBook = {
  query: 'mutation { createBook(title: "API Test", author: "Tester") { id title author } }'
};

const expectedBook = require('../../fixture/response/newBookCreatedSuccessfully.json');
const expectedBooks = require('../../fixture/response/whenGetBooksReturnValidList.json');

describe('GraphQL Book API', () => {
  before(async () => {
    await req(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .send(registerUser);

    const res = await req(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .send(loginUser);

    token = res.body.data.login.token;
  });

  it('should list all books', async () => {
    const res = await req(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: '{ books { id title author } }' });

    expect(res.status).to.equal(200);
    expect(res.body.data.books).excludingEvery(['id']).to.deep.include.members(
      expectedBooks.map(b => ({ title: b.title, author: b.author }))
    );
  });

  it('should create a new book', async () => {
    const res = await req(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(createBook);

    expect(res.status).to.equal(200);
    expect(res.body.data.createBook)
      .excluding('id')
      .to.deep.equal({ title: expectedBook.title, author: expectedBook.author });
  });

  it('should return error for unauthenticated createBook', async () => {
    const res = await req(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .send(createBook);

    expect(res.status).to.equal(400);
    expect(res.body.errors[0].message).to.equal('Context creation failed: No token');
  });
});
