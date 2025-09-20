const model = require('../models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.findByEmail = (email) => {
  return model.users.find((u) => u.email === email);
};

exports.verifyPassword = (user, password) => {
  return user && user.password === password;
};

exports.createUser = ({ name, email, password }) => {
  const user = { id: model.nextId, name, email, password };
  model.users.push(user);
  model.nextId++;
  return user;
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
