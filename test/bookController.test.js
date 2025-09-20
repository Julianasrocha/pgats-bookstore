const chai = require('chai');
const sinon = require('sinon');
const bookService = require('../src/services/bookService');
const bookController = require('../src/rest/controllers/bookController');
const e = require('express');

const expect = chai.expect;

describe('Book Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
  });

  it('should list all books', () => {
    bookController.listBooks(req, res);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.be.an('array');
  });

  it('should create a new book', () => {
    req.body = { title: 'Test', author: 'Tester' };
    bookController.createBook(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.include({ title: 'Test', author: 'Tester' });
  });

  it('should return 400 if title or author missing', () => {
    req.body = { title: '' };
    bookController.createBook(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
