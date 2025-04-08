const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CourseController {
  async createCourse(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can create course numbers' });
    }
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    try {
      const courseNumber = await prisma.courseNumber.create({
        data: { name, description },
      });
      res.status(201).json(courseNumber);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCourses(req, res) {
    try {
      const courseNumbers = await prisma.courseNumber.findMany();
      res.json(courseNumbers);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getCourse(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    try {
      const courseNumber = await prisma.courseNumber.findUnique({
        where: { id },
      });
      if (!courseNumber) return res.status(404).json({ message: 'Course number not found' });
      res.json(courseNumber);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async updateCourse(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can update course numbers' });
    }
    const { name, description } = req.body;
    const id = Number(req.params.id);
    try {
      const courseNumber = await prisma.courseNumber.update({
        where: { id },
        data: { name, description },
      });
      res.json(courseNumber);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCourse(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can delete course numbers' });
    }
    const id = Number(req.params.id);
    try {
      await prisma.courseNumber.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CourseController();