const req = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const app = require('../../../src/rest/app');
const userService = require('../../../src/services/userService');

const expect = chai.expect;

describe('User Controller', () => {
  beforeEach(() => {
    sinon.stub(userService, 'findByEmail');
    sinon.stub(userService, 'verifyPassword');
    sinon.stub(userService, 'generateToken').returns('token');
    sinon.stub(userService, 'createUser').returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
  });

  it('should login user with correct credentials', async () => {
    const requestBody = { email: 'test@email.com', password: 'testpass' };

    //Mocks
    userService.findByEmail.returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
    userService.verifyPassword.returns(true);

    const res = await req(app)
      .post('/users/login')
      .send(requestBody);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should return 401 for invalid credentials', async () => {
    const requestBody = { email: 'test@email.com', password: 'wrongPass' };

    //Mocks
    userService.findByEmail.returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
    userService.verifyPassword.returns(false);

    const res = await req(app)
      .post('/users/login')
      .send(requestBody);

    expect(res.status).to.equal(401);
    expect(res.body).to.be.deep.equals({ error: 'Invalid credentials' });
  });

  it('should register a new user', async () => {
    const requestBody = { name: 'Test', email: 'test@email.com', password: 'testpass' };

    //Mocks
    userService.findByEmail.returns(undefined);

    const res = await req(app)
      .post('/users/register')
      .send(requestBody);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should return 400 if registration fields missing', async () => {
    const requestBody = { name: '', email: '', password: '' };

    const res = await req(app)
      .post('/users/register')
      .send(requestBody);

    expect(res.status).to.equal(400);
    expect(res.body).to.be.deep.equals({ error: 'Name, email, and password are required' });
  });

  it('should return 409 if email already registered', async () => {
    const requestBody = { name: 'Test', email: 'test@email.com', password: 'testpass' };

    //Mocks
    userService.findByEmail.returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });

    const res = await req(app)
      .post('/users/register')
      .send(requestBody);

    expect(res.status).to.equal(409);
    expect(res.body).to.be.deep.equals({ error: 'Email already registered' });
  });

  afterEach(() => {
    sinon.restore();
  });
});
