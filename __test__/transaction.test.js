const request = require('supertest');
const app = require('../app'); // Adjust the path to your app.js
const setup = require('./setup');
const User= require('../models/User.js');

let token;

beforeAll(async () => {
	await setup();

	// Sign up and log in to get a token
	await request(app).post('/api/auth/signup').send({
		name: 'Test User',
		email: 'test@example.com',
		password: 'password123',
	});

	// Manually set isVerified to true
	await User.updateOne({ email: 'test@example.com' }, { isVerified: true });

	const res = await request(app).post('/api/auth/login').send({
		email: 'test@example.com',
		password: 'password123',
	});

	token = res.body.accessToken;
});

afterAll(async () => {
	await setup.teardown();
});

describe('Transaction Endpoints', () => {
	it('should create a new transaction', async () => {
		const res = await request(app)
			.post('/api/transaction')
			.set('Authorization', `Bearer ${token}`)
			.send({
				amount: 100,
				description: 'Test Transaction',
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty(
			'message',
			'Transaction created successfully'
		);
	});

	it('should get all transactions for the authenticated user', async () => {
		const res = await request(app)
			.get('/api/transaction')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});

	it('should get a single transaction by ID', async () => {
		const transaction = await request(app)
			.post('/api/transaction')
			.set('Authorization', `Bearer ${token}`)
			.send({
				amount: 100,
				description: 'Test Transaction',
			});

		const res = await request(app)
			.get(`/api/transaction/${transaction.body.data._id}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('description', 'Test Transaction');
	});

	it('should update a transaction by ID', async () => {
		const transaction = await request(app)
			.post('/api/transaction')
			.set('Authorization', `Bearer ${token}`)
			.send({
				amount: 100,
				description: 'Test Transaction',
			});

		const res = await request(app)
			.put(`/api/transaction/${transaction.body.data._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				amount: 200,
				description: 'Updated Transaction',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty(
			'message',
			'Transaction updated successfully'
		);
	});

	it('should delete a transaction by ID', async () => {
		const transaction = await request(app)
			.post('/api/transaction')
			.set('Authorization', `Bearer ${token}`)
			.send({
				amount: 100,
				description: 'Test Transaction',
			});

		const res = await request(app)
			.delete(`/api/transaction/${transaction.body.data._id}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty(
			'message',
			'Transaction deleted successfully'
		);
	});
});
