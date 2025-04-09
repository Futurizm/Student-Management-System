const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StudentController {
  async createStudent(req, res) {
    const {
      iin, lastName, firstName, middleName, birthDate, gender, citizenship, nationality,
      admissionDate, graduationDate, studyLanguage, specialty, qualification, identityDocument,
      medicalCertificate, groupId, direction, phoneNumber, email, adress, notes, emergencyContact
    } = req.body;

    if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only ADMIN or TEACHER can create students' });
    }

    const formattedBirthDate = birthDate ? new Date(birthDate).toISOString() : undefined;
    const formattedAdmissionDate = admissionDate ? new Date(admissionDate).toISOString() : undefined;
    const formattedGraduationDate = graduationDate ? new Date(graduationDate).toISOString() : undefined;


    const profilePicture = req.file ? `${req.file.destination}${req.file.filename}` : null;


    try {
      const student = await prisma.student.create({
        data: {
          iin,
          lastName,
          firstName,
          middleName,
          birthDate: formattedBirthDate,
          gender,
          citizenship,
          nationality,
          admissionDate: formattedAdmissionDate,
          graduationDate: formattedGraduationDate,
          studyLanguage,
          specialty,
          qualification,
          identityDocument,
          medicalCertificate,
          profilePicture,
          groupId: groupId ? Number(groupId) : null,
          direction,
          phoneNumber,
          email,
          adress,
          notes,
          emergencyContact
        },
      });
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getStudents(req, res) {
    const { page = 1, limit = 10, search } = req.query;
    const where = search ? { OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }] } : {};
    const students = await prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      include: {
        group: true
      }
    });
    res.json(students);
  }

  async getStudent(req, res) {
    const student = await prisma.student.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  }

  async updateStudent(req, res) {
    const {
      iin, lastName, firstName, middleName, birthDate, gender, citizenship, nationality,
      admissionDate, graduationDate, studyLanguage, specialty, qualification, identityDocument,
      medicalCertificate, groupId, direction, phoneNumber, email, adress, notes, emergencyContact
    } = req.body;

    if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only ADMIN or TEACHER can update students' });
    }

    const formattedBirthDate = birthDate ? new Date(birthDate).toISOString() : undefined;
    const formattedAdmissionDate = admissionDate ? new Date(admissionDate).toISOString() : undefined;
    const formattedGraduationDate = graduationDate ? new Date(graduationDate).toISOString() : undefined;

    const profilePicture = req.file ? `${req.file.destination}${req.file.filename}` : undefined;
    console.log(profilePicture)

    try {
      const student = await prisma.student.update({
        where: { id: Number(req.params.id) },
        data: {
          iin,
          lastName,
          firstName,
          middleName,
          birthDate: formattedBirthDate,
          gender,
          citizenship,
          nationality,
          admissionDate: formattedAdmissionDate,
          graduationDate: formattedGraduationDate,
          studyLanguage,
          specialty,
          qualification,
          identityDocument,
          medicalCertificate,
          profilePicture: profilePicture || undefined,
          groupId: groupId ? Number(groupId) : null,
          direction,
          phoneNumber,
          email,
          adress,
          notes,
          emergencyContact
        },
      });
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteStudent(req, res) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only ADMIN or TEACHER can delete students' });
    }

    try {
      await prisma.student.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAttendance(req, res) {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: Number(req.params.id) },
    });
    res.json(attendance);
  }

  async getPerformance(req, res) {
    const performance = await prisma.performance.findMany({
      where: { studentId: Number(req.params.id) },
    });
    res.json(performance);
  }

  async uploadDocument(req, res) {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const document = await prisma.document.create({
      data: {
        studentId: Number(req.params.id),
        filePath: req.file.path,
        fileName: req.file.originalname,
      },
    });
    res.status(201).json(document);
  }
}

module.exports = new StudentController();