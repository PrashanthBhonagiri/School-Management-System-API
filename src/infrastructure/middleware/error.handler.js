const { ApplicationError } = require('../errors/application.error');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        requestId: req.id,
        path: req.path,
        method: req.method
    });

    if (err instanceof ApplicationError) {
        return res.status(err.status).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.validationErrors || undefined
            }
        });
    }

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: Object.values(err.errors).map(error => ({
                    field: error.path,
                    message: error.message
                }))
            }
        });
    }

    // Default error
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;

    res.status(status).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message
        }
    });
};

module.exports = errorHandler;
