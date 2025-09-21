const userService = require('../../services/userService');

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = userService.findByEmail(email);
  if (!user || !userService.verifyPassword(user, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = userService.generateToken(user);
  res.json({ token });
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (userService.findByEmail(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const user = userService.createUser({ name, email, password });
  const token = userService.generateToken(user);
  res.status(201).json({ token });
};
