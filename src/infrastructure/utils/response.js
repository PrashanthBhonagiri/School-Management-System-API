class ResponseFormatter {
    static success(data, message = 'Success', meta = {}) {
        return {
            success: true,
            message,
            data,
            meta
        };
    }

    static error(error, message = 'Error occurred') {
        return {
            success: false,
            message,
            error: {
                code: error.code || 'INTERNAL_SERVER_ERROR',
                message: error.message,
                details: error.details
            }
        };
    }

    static paginated(data, pagination) {
        return {
            success: true,
            data,
            pagination
        };
    }
}

// Response middleware
const responseMiddleware = (req, res, next) => {
    res.success = (data, message, meta) => {
        res.json(ResponseFormatter.success(data, message, meta));
    };

    res.error = (error, message) => {
        const statusCode = error.status || 500;
        res.status(statusCode).json(ResponseFormatter.error(error, message));
    };

    res.paginated = (data, pagination) => {
        res.json(ResponseFormatter.paginated(data, pagination));
    };

    next();
};

module.exports = {
    ResponseFormatter,
    responseMiddleware
};
