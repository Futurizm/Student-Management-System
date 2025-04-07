const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CourseController {
  async createCourse(req, res) {
    const { name, description, teacherId, groupIds, schedule } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can create courses' });
    }

    try {
      const course = await prisma.course.create({
        data: {
          name,
          description,
          teacherId: teacherId ? Number(teacherId) : null,
          groups: groupIds ? { connect: groupIds.map(id => ({ id: Number(id) })) } : undefined,
          schedule,
        },
      });
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async addCourseNumber(req,res) {
    const { name, description } = req.body;
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can add course numbers' });
    }

    try {
      const courseNumber = await prisma.courseNumber.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json(courseNumber);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCourses(req, res) {
    const courses = await prisma.course.findMany({
      include: { teacher: { include: { user: true } }, groups: true },
    });
    res.json(courses);
  }

  async getCourse(req, res) {
    const course = await prisma.course.findUnique({
      where: { id: Number(req.params.id) },
      include: { teacher: { include: { user: true } }, groups: true },
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  }

  async updateCourse(req, res) {
    const { name, description, teacherId, groupIds, schedule } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can update courses' });
    }

    try {
      const course = await prisma.course.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          description,
          teacherId: teacherId ? Number(teacherId) : null,
          groups: groupIds ? { set: groupIds.map(id => ({ id: Number(id) })) } : undefined,
          schedule,
        },
      });
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCourse(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can delete courses' });
    }

    try {
      await prisma.course.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCoursePerformance(req, res) {
    const performance = await prisma.performance.findMany({
      where: { courseId: Number(req.params.id) },
      include: { student: true },
    });
    res.json(performance);
  }

  async addGroupToCourse(req, res) {
    const { groupId } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can add groups to courses' });
    }

    try {
      const course = await prisma.course.update({
        where: { id: Number(req.params.id) },
        data: { groups: { connect: { id: Number(groupId) } } },
      });
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CourseController();