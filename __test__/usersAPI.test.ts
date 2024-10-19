import { server } from '../src';
import supertest from 'supertest';
import { IRequestBody } from '../src/models/userModel';

const request = supertest(server);

const mockUser: IRequestBody = {
  username: 'John Smith',
  age: 35,
  hobbies: ['mock tests'],
};

const updatedUser: IRequestBody = {
  username: 'John Doe',
  age: 40,
  hobbies: ['unit testing', 'integration testing'],
};

describe('User API', (): void => {
  beforeAll((): void => {
    server.close();
    server.listen(4000);
  });

  afterAll(async (): Promise<void> => {
    await new Promise((resolve): void => {
      server.close(() => resolve);
    });
  });

  let createdUserId: string;

  describe('GET /api/users', (): void => {
    it('should return an empty array', async (): Promise<void> => {
      const response = await request.get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([]);
    });
  });

  describe('POST /api/users', (): void => {
    it('should create and return a new user containing expected records', async (): Promise<void> => {
      const response = await request
        .post('/api/users')
        .send(mockUser)
        .set('Content-Type', 'application/json');
      createdUserId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(mockUser.username);
      expect(response.body.age).toBe(mockUser.age);
      expect(response.body.hobbies).toStrictEqual(mockUser.hobbies);
    });
  });

  describe('GET /api/users/:id', (): void => {
    it('should return created user by ID', async (): Promise<void> => {
      const response = await request.get(`/api/users/${createdUserId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body.username).toBe(mockUser.username);
      expect(response.body.age).toBe(mockUser.age);
      expect(response.body.hobbies).toStrictEqual(mockUser.hobbies);
    });
  });

  describe('PUT /api/users/:id', (): void => {
    it('should update and return created user by ID', async (): Promise<void> => {
      const response = await request
        .put(`/api/users/${createdUserId}`)
        .send(updatedUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body.age).toBe(updatedUser.age);
      expect(response.body.hobbies).toStrictEqual(updatedUser.hobbies);
    });
  });

  describe('DELETE /api/users/:id', (): void => {
    it('should delete created user by ID', async (): Promise<void> => {
      const response = await request.delete(`/api/users/${createdUserId}`);

      expect(response.status).toBe(204);
    });
  });

  describe('GET /api/users/:id (non-existent user)', (): void => {
    it('should return 404 "User not found"', async (): Promise<void> => {
      const response = await request.get(`/api/users/${createdUserId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('GET /api/users/error (non-existent route)', (): void => {
    it('should return 500 "Internal Server Error"', async (): Promise<void> => {
      const response = await request.get('/api/users/error');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });
  });
});
