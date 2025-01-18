const request = require('supertest');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../../src/config/test.config');

const generateAuthToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
};

const testRequest = (app) => {
    return request(app);
};

module.exports = {
    generateAuthToken,
    testRequest
};
