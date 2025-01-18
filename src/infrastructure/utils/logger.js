// src/infrastructure/utils/logger.js
const winston = require('winston');
const { createLogger, format, transports } = winston;

// Utility function to handle circular references
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    };
};

// Utility function to extract safe request data
const extractRequestData = (req) => {
    return {
        id: req.id,
        method: req.method,
        url: req.originalUrl || req.url,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: {
            ...req.headers,
            authorization: req.headers.authorization ? '[REDACTED]' : undefined
        },
        timestamp: new Date().toISOString()
    };
};

// Utility function to extract safe response data
const extractResponseData = (res, responseBody) => {
    return {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.getHeaders(),
        body: responseBody
    };
};

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, ...metadata }) => {
            let msg = `${timestamp} [${level}]: `;

            if (typeof message === 'object') {
                msg += JSON.stringify(message, getCircularReplacer(), 2);
            } else {
                msg += message;
            }

            if (Object.keys(metadata).length > 0) {
                msg += `\n${JSON.stringify(metadata, getCircularReplacer(), 2)}`;
            }

            return msg;
        })
    ),
    defaultMeta: { service: 'school-management-api' },
    transports: [
        new transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new transports.File({ 
            filename: 'logs/api.log',
            maxsize: 5242880,
            maxFiles: 5
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, ...metadata }) => {
                let msg = `${timestamp} [${level}]: `;

                if (typeof message === 'object') {
                    msg += JSON.stringify(message, getCircularReplacer(), 2);
                } else {
                    msg += message;
                }

                if (Object.keys(metadata).length > 0 && metadata.service) {
                    delete metadata.service;
                }

                if (Object.keys(metadata).length > 0) {
                    msg += `\n${JSON.stringify(metadata, getCircularReplacer(), 2)}`;
                }

                return msg;
            })
        )
    }));
}

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Store original response.json
    const originalJson = res.json;
    let responseBody;

    // Override response.json
    res.json = function (body) {
        responseBody = body;
        return originalJson.call(this, body);
    };

    // Log request
    logger.info({
        type: 'REQUEST',
        ...extractRequestData(req)
    });

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info({
            type: 'RESPONSE',
            requestId: req.id,
            duration: `${duration}ms`,
            ...extractResponseData(res, responseBody)
        });
    });

    next();
};

module.exports = {
    logger,
    requestLogger
};
