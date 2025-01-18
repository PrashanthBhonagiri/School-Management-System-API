const Joi = require('joi');

const studentSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    dateOfBirth: Joi.date().required().max('now'),
    gender: Joi.string().required().valid('male', 'female', 'other'),
    schoolId: Joi.string().required().hex().length(24),
    classroomId: Joi.string().required().hex().length(24),
    guardianInfo: Joi.object({
        name: Joi.string().required(),
        relationship: Joi.string().required(),
        contact: Joi.object({
            phone: Joi.string().required().pattern(/^\+?[\d\s-]+$/),
            email: Joi.string().email().required(),
            address: Joi.string().required()
        }).required()
    }).required(),
    academicInfo: Joi.object({
        grade: Joi.string().required(),
        section: Joi.string().required(),
        rollNumber: Joi.string().required()
    }).required(),
    status: Joi.string().valid('active', 'inactive', 'transferred', 'graduated')
});

const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    next();
};

module.exports = {
    validateStudent
};
