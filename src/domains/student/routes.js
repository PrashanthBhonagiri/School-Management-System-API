const express = require('express');
const router = express.Router();
const studentController = require('./controller');
const { validateStudent } = require('./validator');
const authMiddleware = require('../../core/middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get all students (with optional filters)
router.get('/', studentController.getStudents.bind(studentController));

// Get specific student
router.get('/:id', studentController.getStudentById.bind(studentController));

// Create student
router.post('/',
    validateStudent,
    studentController.createStudent.bind(studentController)
);

// Update student
router.put('/:id',
    validateStudent,
    studentController.updateStudent.bind(studentController)
);

// Delete student
router.delete('/:id',
    studentController.deleteStudent.bind(studentController)
);

// Transfer student
router.post('/:id/transfer',
    studentController.transferStudent.bind(studentController)
);

module.exports = router;
