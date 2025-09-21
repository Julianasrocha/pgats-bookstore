const req = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const app = require('../../../src/rest/app');
const bookService = require('../../../src/services/bookService');

describe('Book Controller', () => {
    beforeEach(async () => {
        const res = await req(app)
            .post('/users/login')
            .send({
                email: 'juliana@email.com',
                password: '123456'
            });

        token = res.body.token;
    });

    it('should list all books', async () => {
        const expectedBody = require('../../fixture/response/whenGetBooksReturnValidList.json')

        const res = await req(app)
            .get('/books')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(expectedBody);
    });

    it('should create a new book', async () => {
        const requestBody = require('../../fixture/request/bookRequest.json')
        const expectedBody = require('../../fixture/response/newBookCreatedSuccessfully.json')

        const res = await req(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(requestBody)

        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(expectedBody);

    });

    it('Mocked: should create a new book', async () => {
        const requestBody = require('../../fixture/request/bookRequest.json')
        const mockedBody = require('../../fixture/response/mockedResponse.json')

        const bookServiceMock = sinon.stub(bookService, 'createBook');
        bookServiceMock.returns(mockedBody);

        const res = await req(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(requestBody)

        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(mockedBody);

    });

    it('should return 400 if title or author missing', async () => {
        const res = await req(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({})

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error', 'Title and author are required')
    });

    afterEach(() => {
        sinon.restore();
    })
});
