const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/attendance', authMiddleware, reportController.getAttendanceReport);
router.get('/performance', authMiddleware, reportController.getPerformanceReport);
router.get('/summary', authMiddleware, reportController.getSummaryReport);
router.post('/generate', authMiddleware, reportController.generateReport);

module.exports = router;