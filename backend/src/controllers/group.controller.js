const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GroupController {
  async createGroup(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can create groups' });
    }

    const { name, startDate, endDate, specialty, description, schedule, teacherId, courseNumberId } = req.body;

    if (!name || !startDate || !endDate || !specialty || !courseNumberId) {
      return res.status(400).json({ message: 'Name, startDate, endDate, specialty, and courseNumberId are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ message: 'Invalid date format or logic' });
    }

    try {
      const group = await prisma.group.create({
        data: {
          name,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          specialty,
          description,
          schedule,
          teacherId: teacherId ? Number(teacherId) : null,
          courseNumberId: Number(courseNumberId), // Привязываем к CourseNumber
        },
        include: { courseNumber: true, teacher: { include: { user: true } }, students: true },
      });
      res.status(201).json(group);
    } catch (error) {
      console.error('Create group error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async getGroups(req, res) {
    try {
      const groups = await prisma.group.findMany({
        include: {
          students: true,
          courseNumber: true, // Возвращаем CourseNumber вместо courses
          teacher: { include: { user: true } },
        },
      });
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getGroup(req, res) {
    const { id } = req.params;
    const groupId = Number(id);
    if (isNaN(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { teacher: { include: { user: true } }, students: true, courseNumber: true },
      });
      if (!group) return res.status(404).json({ message: 'Group not found' });
      res.json(group);
    } catch (error) {
      console.error('Get group error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async updateGroup(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can update groups' });
    }

    const { name, startDate, endDate, specialty, description, schedule, teacherId, courseNumberId } = req.body;
    const groupId = Number(req.params.id);

    try {
      const group = await prisma.group.update({
        where: { id: groupId },
        data: {
          name,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          specialty,
          description,
          schedule,
          teacherId: teacherId ? Number(teacherId) : null,
          courseNumberId: courseNumberId ? Number(courseNumberId) : undefined,
        },
        include: { courseNumber: true, teacher: { include: { user: true } }, students: true },
      });
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteGroup(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can delete groups' });
    }

    try {
      await prisma.group.delete({ where: { id: Number(req.params.id) } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getGroupStudents(req, res) {
    try {
      const students = await prisma.student.findMany({
        where: { groupId: Number(req.params.id) },
      });
      res.json(students);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addStudentToGroup(req, res) {
    const { studentId } = req.body;
    const groupId = Number(req.params.id);
  
    try {
      // Проверяем, есть ли студент уже в какой-либо группе
      const existingStudent = await prisma.student.findUnique({
        where: { id: Number(studentId) },
        include: { group: true }, // Подтягиваем данные о группе
      });
  
      if (existingStudent?.group) {
        return res.status(400).json({ message: 'Student is already assigned to another group' });
      }
  
      // Добавляем студента в группу
      const group = await prisma.group.update({
        where: { id: groupId },
        data: { students: { connect: { id: Number(studentId) } } },
        include: { students: true },
      });
      res.json(group);
    } catch (error) {
      console.error('Error adding student to group:', error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new GroupController();