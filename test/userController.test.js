const chai = require('chai');
const sinon = require('sinon');
const userController = require('../src/rest/controllers/userController');
const userService = require('../src/services/userService');

const expect = chai.expect;

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    sinon.stub(userService, 'findByEmail');
    sinon.stub(userService, 'verifyPassword');
    sinon.stub(userService, 'generateToken').returns('token');
    sinon.stub(userService, 'createUser').returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should login user with correct credentials', () => {
    req.body = { email: 'test@email.com', password: 'testpass' };
    userService.findByEmail.returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
    userService.verifyPassword.returns(true);
    userController.login(req, res);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('token');
  });

  it('should return 401 for invalid credentials', () => {
    req.body = { email: 'test@email.com', password: 'wrong' };
    userService.findByEmail.returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
    userService.verifyPassword.returns(false);
    userController.login(req, res);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should register a new user', () => {
    req.body = { name: 'Test', email: 'test@email.com', password: 'testpass' };
    userService.findByEmail.returns(undefined);
    userController.register(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('token');
  });

  it('should return 400 if registration fields missing', () => {
    req.body = { name: '', email: '', password: '' };
    userController.register(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should return 409 if email already registered', () => {
    req.body = { name: 'Test', email: 'test@email.com', password: 'testpass' };
    userService.findByEmail.returns({ id: 3, name: 'Test', email: 'test@email.com', password: 'testpass' });
    userController.register(req, res);
    expect(res.status.calledWith(409)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
