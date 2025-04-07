const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

class TeacherController {
  async createTeacher(req, res) {
    const {
      email, password, lastName, firstName, middleName, birthDate, phone, address, position, department,
      subjects, education, experience, profilePicture, groupIds
    } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can create teachers' });
    }

    const formattedBirthDate = birthDate ? new Date(birthDate).toISOString() : undefined;
    const subjectsJson = subjects ? JSON.stringify(subjects) : undefined;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'TEACHER',
          teacher: {
            create: {
              lastName,
              firstName,
              middleName,
              birthDate: formattedBirthDate,
              phone,
              address,
              position,
              department,
              subjects: subjectsJson,
              education,
              experience,
              profilePicture,
              groups: groupIds ? { connect: groupIds.map(id => ({ id: Number(id) })) } : undefined,
            },
          },
        },
        include: { teacher: true },
      });
      res.status(201).json({
        ...user.teacher,
        email: user.email,
        subjects: user.teacher.subjects ? JSON.parse(user.teacher.subjects) : [],
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTeachers(req, res) {
    const teachers = await prisma.teacher.findMany({ include: { user: true, groups: true } });
    const result = teachers.map(teacher => ({
      ...teacher,
      email: teacher.user.email,
      subjects: teacher.subjects ? JSON.parse(teacher.subjects) : [],
    }));
    res.json(result);
  }

  async getTeacher(req, res) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, groups: true },
    });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({
      ...teacher,
      email: teacher.user.email,
      subjects: teacher.subjects ? JSON.parse(teacher.subjects) : [],
    });
  }

  async updateTeacher(req, res) {
    const {
      lastName, firstName, middleName, birthDate, phone, address, position, department,
      subjects, education, experience, profilePicture, groupIds
    } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can update teachers' });
    }

    const formattedBirthDate = birthDate ? new Date(birthDate).toISOString() : undefined;
    const subjectsJson = subjects ? JSON.stringify(subjects) : undefined;

    try {
      const teacher = await prisma.teacher.update({
        where: { id: Number(req.params.id) },
        data: {
          lastName,
          firstName,
          middleName,
          birthDate: formattedBirthDate,
          phone,
          address,
          position,
          department,
          subjects: subjectsJson,
          education,
          experience,
          profilePicture,
          groups: groupIds ? { set: groupIds.map(id => ({ id: Number(id) })) } : undefined,
        },
      });
      res.json({
        ...teacher,
        subjects: teacher.subjects ? JSON.parse(teacher.subjects) : [],
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTeacher(req, res) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN can delete teachers' });
    }

    try {
      await prisma.teacher.delete({ where: { id: Number(req.params.id) } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTeacherStudents(req, res) {
    if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only TEACHER or ADMIN can view students' });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.user.id },
      include: { groups: { include: { students: true } } },
    });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    const students = teacher.groups.flatMap(group => group.students);
    res.json(students);
  }

  async getTeacherCourses(req, res) {
    const courses = await prisma.course.findMany({ where: { teacherId: Number(req.params.id) } });
    res.json(courses);
  }

  async getTeacherGroups(req, res) {
    const groups = await prisma.group.findMany({ where: { teacherId: Number(req.params.id) } });
    res.json(groups);
  }
}

module.exports = new TeacherController();