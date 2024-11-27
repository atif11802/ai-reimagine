const request = require('supertest');
const app = require('../app'); // Adjust the path to your app.js
const setup = require('./setup');

beforeAll(async () => {
	await setup();
});

afterAll(async () => {
	await setup.teardown();
});

describe('Auth Endpoints', () => {
	it('should sign up a new user', async () => {
		const res = await request(app).post('/api/auth/signup').send({
			name: 'Test User',
			email: 'test@example.com',
			password: 'password123',
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty(
			'message',
			'Please check your email for verification link'
		);
		
	});

	it('should log in an existing user', async () => {
		const res = await request(app).post('/api/auth/login').send({
			email: 'test@example.com',
			password: 'password123',
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('accessToken');
	});
});
