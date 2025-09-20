const chai = require('chai');
const bookService = require('../src/services/bookService');
const expect = chai.expect;

describe('Book Service', () => {
  it('should return all books', () => {
    const books = bookService.getAllBooks();
    expect(books).to.be.an('array');
    expect(books.length).to.be.greaterThan(0);
  });

  it('should create a new book', () => {
    const book = bookService.createBook({ title: 'New', author: 'Author' });
    expect(book).to.include({ title: 'New', author: 'Author' });
    const books = bookService.getAllBooks();
    expect(books).to.deep.include(book);
  });
});
