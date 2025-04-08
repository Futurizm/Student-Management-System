const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, groupController.createGroup);
router.get('/', authMiddleware, groupController.getGroups);
router.get('/:id', authMiddleware, groupController.getGroup);
router.put('/:id', authMiddleware, groupController.updateGroup);
router.delete('/:id', authMiddleware, groupController.deleteGroup);
router.get('/:id/students', authMiddleware, groupController.getGroupStudents);
router.post('/:id/students', authMiddleware, groupController.addStudentToGroup);

module.exports = router;        