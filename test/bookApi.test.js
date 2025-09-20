const request = require('supertest');
const app = require('../src/rest/app');

describe('Book API', () => {
  let token;
  before(done => {
    // Register and login a user to get a token
    request(app)
      .post('/users/register')
      .send({ name: 'Test', email: 'apitest@email.com', password: 'testpass' })
      .end(() => {
        request(app)
          .post('/users/login')
          .send({ email: 'apitest@email.com', password: 'testpass' })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            token = res.body.token;
            done();
          });
      });
  });

  it('should require auth for /books', (done) => {
    request(app).get('/books').expect(401, done);
  });

  it('should list books with valid token', (done) => {
    request(app)
      .get('/books')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(res => {
        if (!Array.isArray(res.body)) throw new Error('Not array');
      })
      .end(done);
  });

  it('should create book with valid token', (done) => {
    request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + token)
      .send({ title: 'API Test', author: 'API' })
      .expect(201)
      .expect(res => {
        if (res.body.title !== 'API Test') throw new Error('Wrong title');
      })
      .end(done);
  });
});
