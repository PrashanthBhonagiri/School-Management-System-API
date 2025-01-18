const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { envConfig } = require('../../config');
const errorHandler = require('../../core/middleware/error.middleware');
const databaseConnection = require('../../infrastructure/database/mongoose.connection');
const { responseMiddleware } = require('../../infrastructure/utils/response');
const { requestLogger } = require('../../infrastructure/utils/logger');
const rateLimits = require('../../infrastructure/middleware/rate.limiter');
const apiLogger = require('../../infrastructure/middleware/api.logger');
const SecurityMiddleware = require('../../infrastructure/middleware/security/');
const InputSanitizer = require('../../infrastructure/middleware/security/sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

class App {
    constructor() {
        this.app = express();
        this.setupSecurity();  // Call security setup first
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    async init() {
        await databaseConnection.connect();
        return this;
    }

    setupSecurity() {
        // Initialize core security features
        SecurityMiddleware.init(this.app);

        // Additional security middleware
        this.app.use(helmet());
        
        // CORS configuration
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            exposedHeaders: ['X-Total-Count'],
            credentials: true,
            maxAge: 86400
        }));

        // Body parser with size limits
        this.app.use(express.json({ limit: '10kb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));

        // Data sanitization
        this.app.use(mongoSanitize()); // Against NoSQL query injection
        this.app.use(xss()); // Against XSS
        this.app.use(InputSanitizer.middleware());

        // Additional security headers
        this.app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            next();
        });
    }

    setupMiddleware() {
        // Logging middleware
        this.app.use(apiLogger);
        this.app.use(requestLogger);
        
        // Response formatting
        this.app.use(responseMiddleware);

        // Rate limiting
        this.app.use(rateLimits.default);
        this.app.use('/api/auth', rateLimits.auth);
        this.app.use('/api', rateLimits.api);

        // Trust proxy if behind a reverse proxy
        if (process.env.NODE_ENV === 'production') {
            this.app.enable('trust proxy');
        }
    }

    setupRoutes() {
        // Health check route
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Server is healthy',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            });
        });

        // API routes
        this.app.use('/api/auth', require('../../domains/auth/routes'));
        this.app.use('/api/schools', require('../../domains/school/routes'));
        this.app.use('/api/classrooms', require('../../domains/classroom/routes'));
        this.app.use('/api/students', require('../../domains/student/routes'));

        // Handle undefined routes
        this.app.all('*', (req, res, next) => {
            const err = new Error(`Route ${req.originalUrl} not found`);
            err.status = 404;
            next(err);
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res, next) => {
            const error = new Error('Route not found');
            error.status = 404;
            next(error);
        });

        // Global error handler
        this.app.use(errorHandler);
    }

    listen() {
        return this.app.listen(envConfig.app.port, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${envConfig.app.port}`);
        });
    }
}

module.exports = App;
