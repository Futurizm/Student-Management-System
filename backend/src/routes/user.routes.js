const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, userController.createUser);
router.get('/', authMiddleware, userController.getUsers);

module.exports = router;