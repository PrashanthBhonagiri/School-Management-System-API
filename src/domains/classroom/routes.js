const express = require('express');
const router = express.Router();
const classroomController = require('./controller');
const { validateClassroom } = require('./validator');
const authMiddleware = require('../../core/middleware/auth.middleware');
const roleMiddleware = require('../../core/middleware/role.middleware');

router.use(authMiddleware);

// Get all classrooms (with optional schoolId filter)
router.get('/', classroomController.getClassrooms.bind(classroomController));

// Get specific classroom
router.get('/:id', classroomController.getClassroomById.bind(classroomController));

// Create classroom (both superadmin and school admin)
router.post('/',
    validateClassroom,
    classroomController.createClassroom.bind(classroomController)
);

// Update classroom
router.put('/:id',
    validateClassroom,
    classroomController.updateClassroom.bind(classroomController)
);

// Delete classroom
router.delete('/:id',
    classroomController.deleteClassroom.bind(classroomController)
);

module.exports = router;
