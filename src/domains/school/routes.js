const express = require('express');
const router = express.Router();
const schoolController = require('./controller');
const { validateSchool } = require('./validator');
const authMiddleware = require('../../core/middleware/auth.middleware');
const roleMiddleware = require('../../core/middleware/role.middleware');

router.use(authMiddleware);

router.get('/', schoolController.getSchools.bind(schoolController));
router.get('/:id', schoolController.getSchoolById.bind(schoolController));

router.post('/',
    roleMiddleware(['superadmin']),
    validateSchool,
    schoolController.createSchool.bind(schoolController)
);

router.put('/:id',
    roleMiddleware(['superadmin']),
    validateSchool,
    schoolController.updateSchool.bind(schoolController)
);

router.delete('/:id',
    roleMiddleware(['superadmin']),
    schoolController.deleteSchool.bind(schoolController)
);

module.exports = router;
