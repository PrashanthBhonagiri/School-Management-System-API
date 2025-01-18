const Joi = require('joi');

const resourceSchema = Joi.object({
    type: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required()
});

const classroomSchema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    schoolId: Joi.string().required().hex().length(24),
    capacity: Joi.number().integer().min(1).required(),
    grade: Joi.string().required(),
    section: Joi.string().required(),
    teacher: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^\+?[\d\s-]+$/).required()
    }),
    resources: Joi.array().items(resourceSchema),
    isActive: Joi.boolean()
});

const validateClassroom = (req, res, next) => {
    const { error } = classroomSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};

module.exports = {
    validateClassroom
};
