const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, studentController.createStudent);
router.get('/', authMiddleware, studentController.getStudents);
router.get('/:id', authMiddleware, studentController.getStudent);
router.put('/:id', authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, studentController.deleteStudent);
router.get('/:id/attendance', authMiddleware, studentController.getAttendance);
router.get('/:id/performance', authMiddleware, studentController.getPerformance);
router.post('/:id/documents', authMiddleware, studentController.uploadDocument);

module.exports = router;