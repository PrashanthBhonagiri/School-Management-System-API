const express = require('express');
const router = express.Router();
const authController = require('./controller');

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

module.exports = router;
