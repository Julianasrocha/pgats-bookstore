const req = require('supertest');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude)

require('dotenv').config();

describe('External - User Controller', () => {
    it('should login user with correct credentials', async () => {
        const requestBody = { email: 'juliana@email.com', password: '123456' };

        const res = await req(process.env.BASE_URL_REST)
            .post('/users/login')
            .send(requestBody);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });

    it('should return 401 for invalid credentials', async () => {
        const requestBody = { email: 'juliana@email.com', password: 'wrongPass' };

        const res = await req(process.env.BASE_URL_REST)
            .post('/users/login')
            .send(requestBody);

        expect(res.status).to.equal(401);
        expect(res.body).to.be.deep.equals({ error: 'Invalid credentials' });
    });

    it('should register a new user', async () => {
        const requestBody = { name: 'Test', email: 'test@email.com', password: 'testpass' };

        const res = await req(process.env.BASE_URL_REST)
            .post('/users/register')
            .send(requestBody);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');
    });

    it('should return 400 if registration fields missing', async () => {
        const requestBody = { name: '', email: '', password: '' };

        const res = await req(process.env.BASE_URL_REST)
            .post('/users/register')
            .send(requestBody);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.deep.equals({ error: 'Name, email, and password are required' });
    });

    it('should return 409 if email already registered', async () => {
        const requestBody = { name: 'Test', email: 'test@email.com', password: 'testpass' };

        const res = await req(process.env.BASE_URL_REST)
            .post('/users/register')
            .send(requestBody);

        expect(res.status).to.equal(409);
        expect(res.body).to.be.deep.equals({ error: 'Email already registered' });
    });
});
