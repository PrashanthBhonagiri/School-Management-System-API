const Joi = require('joi');
const { ValidationError } = require('../../errors/application.error');

class RequestValidator {
    static validate(schema) {
        return (req, res, next) => {
            const validationOptions = {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            };

            const validateData = {
                body: req.body,
                query: req.query,
                params: req.params
            };

            const { error } = schema.validate(validateData, validationOptions);

            if (error) {
                const validationErrors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }));

                return next(new ValidationError('Validation failed', validationErrors));
            }

            next();
        };
    }

    static createSchema(definition) {
        return Joi.object(definition);
    }
}

module.exports = RequestValidator;
