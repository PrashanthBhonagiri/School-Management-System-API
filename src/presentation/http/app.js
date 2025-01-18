const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { envConfig } = require('../../config');
const errorHandler = require('../../core/middleware/error.middleware');
const databaseConnection = require('../../infrastructure/database/mongoose.connection');

class App {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    async init() {
        await databaseConnection.connect();
        return this;
    }

    setupMiddleware() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Server is healthy',
                timestamp: new Date().toISOString()
            });
        });

        this.app.use('/api/auth', require('../../domains/auth/routes'));

        this.app.use('/api/schools', require('../../domains/school/routes'));

        this.app.use('/api/classrooms', require('../../domains/classroom/routes'));

        this.app.use('/api/students', require('../../domains/student/routes'));


    }

    setupErrorHandling() {
        this.app.use((req, res, next) => {
            const error = new Error('Route not found');
            error.status = 404;
            next(error);
        });

        this.app.use(errorHandler);
    }

    listen() {
        return this.app.listen(envConfig.app.port, () => {
            console.log(`Server running on port ${envConfig.app.port}`);
        });
    }
}

module.exports = App;
