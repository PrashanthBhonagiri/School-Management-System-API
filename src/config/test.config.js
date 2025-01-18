module.exports = {
    mongodb: {
        url: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/school-management-test'
    },
    jwt: {
        secret: 'this-is-my-test-secret-key',
        expiresIn: '1h'
    }
};
