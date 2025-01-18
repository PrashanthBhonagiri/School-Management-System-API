const { logger } = require('../utils/logger');

const apiLogger = (req, res, next) => {
    // Generate request ID if not exists
    req.id = req.id || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const start = Date.now();
    
    // Capture the original send and json methods
    const originalSend = res.send;
    const originalJson = res.json;
    let responseBody;

    // Override send
    res.send = function (body) {
        responseBody = body;
        return originalSend.call(this, body);
    };

    // Override json
    res.json = function (body) {
        responseBody = body;
        return originalJson.call(this, body);
    };

    // Log request
    logger.info({
        message: 'Incoming Request',
        type: 'REQUEST',
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params
    });

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info({
            message: 'Outgoing Response',
            type: 'RESPONSE',
            requestId: req.id,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            headers: res.getHeaders(),
            body: responseBody
        });
    });

    next();
};

module.exports = apiLogger;
