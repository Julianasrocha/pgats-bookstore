const model = require('../models/book');

exports.getAllBooks = () => model.books;

exports.createBook = ({ title, author }) => {
  const book = { id: model.nextId++, title, author };
  model.books.push(book);
  return book;
};
