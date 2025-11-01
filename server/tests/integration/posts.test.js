// bugs.test.js - Integration tests for bugs API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

let mongoServer;
let bugId;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test bug
  const bug = await Bug.create({
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe'
  });
  bugId = bug._id;
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  // Keep the test bug, but clean up any other created data
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection.collectionName !== 'bugs') {
      await collection.deleteMany({});
    }
  }
});

describe('POST /api/bugs', () => {
  it('should create a new bug', async () => {
    const newBug = {
      title: 'New Test Bug',
      description: 'This is a new test bug description',
      status: 'open',
      priority: 'medium',
      reporter: 'Jane Smith'
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(newBug);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newBug.title);
    expect(res.body.description).toBe(newBug.description);
    expect(res.body.reporter).toBe(newBug.reporter);
  });

  it('should return 400 if validation fails', async () => {
    const invalidBug = {
      // Missing title
      description: 'This bug is missing a title',
      reporter: 'John Doe'
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(invalidBug);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 for title too long', async () => {
    const invalidBug = {
      title: 'a'.repeat(101), // 101 characters
      description: 'Valid description',
      reporter: 'John Doe'
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(invalidBug);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('GET /api/bugs', () => {
  it('should return all bugs', async () => {
    const res = await request(app).get('/api/bugs');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bugs)).toBeTruthy();
    expect(res.body.bugs.length).toBeGreaterThan(0);
  });

  it('should filter bugs by status', async () => {
    // Create a bug with specific status
    await Bug.create({
      title: 'Resolved Bug',
      description: 'This bug is resolved',
      status: 'resolved',
      priority: 'low',
      reporter: 'Alice'
    });

    const res = await request(app)
      .get('/api/bugs?status=resolved');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bugs)).toBeTruthy();
    expect(res.body.bugs.length).toBeGreaterThan(0);
    expect(res.body.bugs[0].status).toBe('resolved');
  });

  it('should filter bugs by priority', async () => {
    const res = await request(app)
      .get('/api/bugs?priority=high');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bugs)).toBeTruthy();
    expect(res.body.bugs[0].priority).toBe('high');
  });

  it('should paginate results', async () => {
    // Create multiple bugs
    const bugs = [];
    for (let i = 0; i < 15; i++) {
      bugs.push({
        title: `Pagination Bug ${i}`,
        description: `Description for pagination test ${i}`,
        status: 'open',
        priority: 'medium',
        reporter: `Reporter ${i}`
      });
    }
    await Bug.insertMany(bugs);

    const page1 = await request(app)
      .get('/api/bugs?page=1&limit=10');

    const page2 = await request(app)
      .get('/api/bugs?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.bugs.length).toBe(10);
    expect(page2.body.bugs.length).toBeGreaterThan(0);
    expect(page1.body.bugs[0]._id).not.toBe(page2.body.bugs[0]._id);
  });
});

describe('GET /api/bugs/:id', () => {
  it('should return a bug by ID', async () => {
    const res = await request(app)
      .get(`/api/bugs/${bugId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(bugId.toString());
    expect(res.body.title).toBe('Test Bug');
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/bugs/${nonExistentId}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/bugs/:id', () => {
  it('should update a bug', async () => {
    const updates = {
      title: 'Updated Test Bug',
      description: 'This description has been updated',
      status: 'in-progress'
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
    expect(res.body.description).toBe(updates.description);
    expect(res.body.status).toBe(updates.status);
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = mongoose.Types.ObjectId();
    const updates = {
      title: 'Non-existent Update'
    };

    const res = await request(app)
      .put(`/api/bugs/${nonExistentId}`)
      .send(updates);

    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid status update', async () => {
    const updates = {
      status: 'invalid-status'
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('DELETE /api/bugs/:id', () => {
  it('should delete a bug', async () => {
    const res = await request(app)
      .delete(`/api/bugs/${bugId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Bug deleted successfully');

    // Verify bug is deleted
    const deletedBug = await Bug.findById(bugId);
    expect(deletedBug).toBeNull();
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/bugs/${nonExistentId}`);

    expect(res.status).toBe(404);
  });
});
