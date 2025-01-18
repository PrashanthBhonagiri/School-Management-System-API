const Joi = require('joi');

class ValidationUtility {
    static validate(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                const validationError = new ValidationError('Validation failed');
                error.details.forEach(detail => {
                    validationError.addValidationError(
                        detail.path.join('.'),
                        detail.message
                    );
                });
                return next(validationError);
            }

            next();
        };
    }

    static createSchema(definition) {
        return Joi.object(definition);
    }
}

module.exports = ValidationUtility;
