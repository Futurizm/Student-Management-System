const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GroupController {
  async createGroup(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can create groups' });
    }

    const { name, startDate, endDate, specialty, description, schedule, teacherId } = req.body;
    const formattedStartDate = startDate ? new Date(startDate).toISOString() : undefined;
    const formattedEndDate = endDate ? new Date(endDate).toISOString() : undefined;

    try {
      const group = await prisma.group.create({
        data: {
          name,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          specialty,
          description,
          schedule,
          teacherId: teacherId ? Number(teacherId) : null,
        },
      });
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getGroups(req, res) {
    const groups = await prisma.group.findMany({
      include: { teacher: { include: { user: true } }, students: true },
    });
    res.json(groups);
  }

  async getGroup(req, res) {
    const group = await prisma.group.findUnique({
      where: { id: Number(req.params.id) },
      include: { teacher: { include: { user: true } }, students: true },
    });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  }

  async updateGroup(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can update groups' });
    }

    const { name, startDate, endDate, specialty, description, schedule, teacherId } = req.body;
    const formattedStartDate = startDate ? new Date(startDate).toISOString() : undefined;
    const formattedEndDate = endDate ? new Date(endDate).toISOString() : undefined;

    try {
      const group = await prisma.group.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          specialty,
          description,
          schedule,
          teacherId: teacherId ? Number(teacherId) : null,
        },
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
    const students = await prisma.student.findMany({
      where: { groupId: Number(req.params.id) },
    });
    res.json(students);
  }

  async addStudentToGroup(req, res) {
    const { studentId } = req.body;
    try {
      const group = await prisma.group.update({
        where: { id: Number(req.params.id) },
        data: { students: { connect: { id: Number(studentId) } } },
      });
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new GroupController();