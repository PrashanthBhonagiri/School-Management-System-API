const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');

// Create Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

const createRateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // Limit each IP to 100 requests per windowMs
        message = 'Too many requests from this IP, please try again later'
    } = options;

    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message
            }
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// Different rate limits for different routes
const rateLimits = {
    default: createRateLimiter(),
    auth: createRateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5 // Limit each IP to 5 login attempts per windowMs
    }),
    api: createRateLimiter({
        windowMs: 60 * 1000, // 1 minute
        max: 60 // Limit each IP to 60 requests per minute
    })
};

module.exports = rateLimits;
