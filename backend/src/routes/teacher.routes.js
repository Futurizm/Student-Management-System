const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, teacherController.createTeacher);
router.get('/', authMiddleware, teacherController.getTeachers);
router.get('/:id', authMiddleware, teacherController.getTeacher);
router.put('/:id', authMiddleware, teacherController.updateTeacher);
router.delete('/:id', authMiddleware, teacherController.deleteTeacher);
router.get('/students', authMiddleware, teacherController.getTeacherStudents);
router.get('/:id/courses', authMiddleware, teacherController.getTeacherCourses);
router.get('/:id/groups', authMiddleware, teacherController.getTeacherGroups);

module.exports = router;