const express = require('express');
const bookController = require('../controllers/bookController');
const userService = require('../../services/userService');

const router = express.Router();

// JWT middleware for books
router.use((req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).end();
  const token = auth.replace('Bearer ', '');
  const user = userService.verifyToken(token);
  if (!user) return res.status(401).end();
  req.user = user;
  next();
});

router.get('/', bookController.listBooks);
router.post('/', bookController.createBook);

module.exports = router;