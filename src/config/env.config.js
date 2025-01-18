require('dotenv').config();

const envConfig = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'test-secret-key-soar!',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
};

module.exports = envConfig;