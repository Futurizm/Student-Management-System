const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, courseController.createCourse);
router.get('/', authMiddleware, courseController.getCourses);
router.get('/:id', authMiddleware, courseController.getCourse);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.get('/:id/performance', authMiddleware, courseController.getCoursePerformance);
router.post('/:id/groups', authMiddleware, courseController.addGroupToCourse);
router.post('/courseNumber', authMiddleware, courseController.addCourseNumber);

module.exports = router;