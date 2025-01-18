const Joi = require('joi');

const schoolSchema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required()
    }).required(),
    contactInfo: Joi.object({
        email: Joi.string().email().required(),
        phone: Joi.string().required().pattern(/^\+?[\d\s-]+$/)
    }).required()
});

const validateSchool = (req, res, next) => {
    const { error } = schoolSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};

module.exports = {
    validateSchool
};
