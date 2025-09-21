const req = require('supertest');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude)

require('dotenv').config();

describe('External - Book Controller', () => {
    before(async () => {
        const res = await req(process.env.BASE_URL_REST)
            .post('/users/login')
            .send({
                email: 'juliana@email.com',
                password: '123456'
            });

        token = res.body.token;
    });

    it('should list all books', async () => {
        const expectedBody = require('../../fixture/response/whenGetBooksReturnValidList.json')

        const res = await req(process.env.BASE_URL_REST)
            .get('/books')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(expectedBody);
    });

    it('should create a new book', async () => {
        const requestBody = require('../../fixture/request/bookRequest.json')
        const expectedBody = require('../../fixture/response/newBookCreatedSuccessfully.json')

        const res = await req(process.env.BASE_URL_REST)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(requestBody)

        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(expectedBody);

    });

    it('should return 400 if title or author missing', async () => {
        const res = await req(process.env.BASE_URL_REST)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({})

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error', 'Title and author are required')
    });


});
