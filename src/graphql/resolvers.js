const bookService = require('../services/bookService');
const userService = require('../services/userService');

module.exports = {
  Query: {
    books: () => bookService.getAllBooks(),
  },
  Mutation: {
    createBook: (_, { title, author }) => bookService.createBook({ title, author }),
    register: (_, { name, email, password }) => {
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }
      if (userService.findByEmail(email)) {
        throw new Error('Email already registered');
      }
      const user = userService.createUser({ name, email, password });
      const token = userService.generateToken(user);
      return { token, user };
    },
    login: (_, { email, password }) => {
      const user = userService.findByEmail(email);
      if (!user || !userService.verifyPassword(user, password)) {
        throw new Error('Invalid credentials');
      }
      const token = userService.generateToken(user);
      return { token, user };
    },
  },
};
