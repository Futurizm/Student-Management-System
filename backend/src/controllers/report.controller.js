const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReportController {
  async getAttendanceReport(req, res) {
    const attendance = await prisma.attendance.groupBy({
      by: ['studentId'],
      _count: { id: true },
    });
    res.json(attendance);
  }

  async getPerformanceReport(req, res) {
    const performance = await prisma.performance.groupBy({
      by: ['studentId', 'courseId'],
      _avg: { grade: true },
    });
    res.json(performance);
  }

  async getSummaryReport(req, res) {
    const summary = await prisma.student.findMany({
      include: { attendance: true, performance: true },
    });
    res.json(summary);
  }

  async generateReport(req, res) {
    const { type, filters } = req.body;
    let report;
    if (type === 'attendance') {
      report = await prisma.attendance.findMany({ where: filters });
    } else if (type === 'performance') {
      report = await prisma.performance.findMany({ where: filters });
    }
    res.json(report);
  }
}

module.exports = new ReportController();