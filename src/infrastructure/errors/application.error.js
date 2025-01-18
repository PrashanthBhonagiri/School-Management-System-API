class ApplicationError extends Error {
    constructor(message, status = 500, code = 'INTERNAL_SERVER_ERROR') {
        super(message);
        this.status = status;
        this.code = code;
    }
}

class ValidationError extends ApplicationError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
        this.validationErrors = [];
    }

    addValidationError(field, message) {
        this.validationErrors.push({ field, message });
    }
}

class AuthenticationError extends ApplicationError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

class AuthorizationError extends ApplicationError {
    constructor(message = 'Not authorized') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

module.exports = {
    ApplicationError,
    ValidationError,
    AuthenticationError,
    AuthorizationError
};

