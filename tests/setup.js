const mongoose = require('mongoose');
const { mongodb } = require('../src/config/test.config');

beforeAll(async () => {
    await mongoose.connect(mongodb.url);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
