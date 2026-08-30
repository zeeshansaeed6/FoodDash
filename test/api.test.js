import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/index.js';

describe('FoodDash Backend API Tests', () => {
  it('GET /api/locations should return list of cities', async () => {
    const res = await request(app).get('/api/locations');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.cities)).toBe(true);
    expect(res.body.cities.length).toBeGreaterThan(0);
    expect(res.body.cities[0]).toHaveProperty('id');
    expect(res.body.cities[0]).toHaveProperty('name');
  });

  it('GET /api/restaurants should filter by city', async () => {
    const res = await request(app).get('/api/restaurants?cityId=bangalore');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.restaurants)).toBe(true);
    expect(res.body.restaurants[0].cityId).toBe('bangalore');
  });

  it('POST /api/auth/send-otp should generate mock OTP', async () => {
    const res = await request(app)
      .post('/api/auth/send-otp')
      .send({ phone: '9876543210' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/verify-otp should authenticate user', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: '9876543210', otp: '1234' }); // 1234 is the universal test OTP
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.phone).toBe('9876543210');
  });

  it('POST /api/orders should create a new order', async () => {
    const orderPayload = {
      restaurantId: 1,
      restaurantName: 'Test Restaurant',
      items: [{ id: '101', name: 'Test Item', price: 100, qty: 1 }],
      bill: { itemTotal: 100, grandTotal: 150 },
      paymentMethod: 'card',
      customerLocation: { lat: 12.9, lng: 77.6, address: 'Test' }
    };
    const res = await request(app)
      .post('/api/orders')
      .send(orderPayload);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toHaveProperty('id');
    expect(res.body.order.status).toBe('confirmed');
  });

  it('POST /api/payments/intent should generate client secret', async () => {
    const res = await request(app)
      .post('/api/payments/intent')
      .send({ amount: 500, orderId: 'TEST-123' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('clientSecret');
    expect(res.body).toHaveProperty('transactionId');
  });
});
