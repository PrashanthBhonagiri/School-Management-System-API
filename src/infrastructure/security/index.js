const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const securityConfig = require('../../../config/security.config');

class SecurityMiddleware {
    static init(app) {
        // 1. Helmet security headers
        app.use(helmet(securityConfig.helmet));

        // 2. CORS configuration
        app.use(cors(securityConfig.cors));

        // 3. Rate limiting
        const limiter = rateLimit({
            windowMs: securityConfig.rateLimit.window,
            max: securityConfig.rateLimit.max,
            message: {
                status: 'error',
                message: 'Too many requests, please try again later.'
            },
            standardHeaders: true,
            legacyHeaders: false
        });
        app.use(limiter);

        // 4. Body parser (with size limits)
        app.use(express.json({ limit: '10kb' }));
        app.use(express.urlencoded({ extended: true, limit: '10kb' }));

        // 5. Data sanitization against XSS
        app.use(xss());

        // 6. Data sanitization against NoSQL query injection
        app.use(mongoSanitize());

        // 7. Additional security headers
        app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            next();
        });
    }
}

module.exports = SecurityMiddleware;
