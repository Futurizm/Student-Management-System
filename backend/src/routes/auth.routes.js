const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authMiddleware, roleMiddleware(['ADMIN']), authController.register);
router.get('/me', authMiddleware, authController.me);

module.exports = router;