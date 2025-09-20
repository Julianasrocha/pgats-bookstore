const chai = require('chai');
const userService = require('../src/services/userService');
const expect = chai.expect;

describe('User Service', () => {
  it('should find user by email', () => {
    const user = userService.findByEmail('juliana@email.com');
    expect(user).to.exist;
    expect(user.name).to.equal('Juliana');
  });

  it('should not find non-existent user', () => {
    const user = userService.findByEmail('notfound@email.com');
    expect(user).to.not.exist;
  });

  it('should verify correct password', () => {
    const user = userService.findByEmail('juliana@email.com');
    expect(userService.verifyPassword(user, '123456')).to.be.true;
  });

  it('should not verify incorrect password', () => {
    const user = userService.findByEmail('juliana@email.com');
    expect(userService.verifyPassword(user, 'wrong')).to.be.false;
  });

  it('should create a new user', () => {
    const user = userService.createUser({ name: 'Test', email: 'test@email.com', password: 'testpass' });
    expect(user).to.include({ name: 'Test', email: 'test@email.com', password: 'testpass' });
    const found = userService.findByEmail('test@email.com');
    expect(found).to.exist;
  });

  it('should generate and verify token', () => {
    const user = userService.findByEmail('juliana@email.com');
    const token = userService.generateToken(user);
    const decoded = userService.verifyToken(token);
    expect(decoded).to.include({ email: 'juliana@email.com', id: 1 });
  });

  it('should return null for invalid token', () => {
    expect(userService.verifyToken('invalid')).to.be.null;
  });
});
