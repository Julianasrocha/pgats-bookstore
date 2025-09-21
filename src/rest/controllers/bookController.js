const bookService = require('../../services/bookService');

exports.listBooks = (req, res) => {
  const books = bookService.getAllBooks();
  res.json(books);
};

exports.createBook = (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  const book = bookService.createBook({ title, author });
  res.status(201).json(book);
};
