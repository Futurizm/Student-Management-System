const { prisma } = require("../prisma/prisma-client");

const StudentController = {
  getStudents: async (req, res) => {
    try {
      const students = await prisma.student.findMany();
      if (!students) {
        return res.status(404).json({ message: "Студенты не найдены" });
      }
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in getStudents method" });
    }
  },
  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await prisma.student.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!student) {
        return res.status(404).json({ message: "Студент не найден" });
      }
      res.status(200).json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in getStudentById method" });
    }
  },
  createStudent: async (req, res) => {
    try {
      const body = req.body;

      let isoDate;
      try {
        const [day, month, year] = body.birthdate.split(".");
        isoDate = new Date(`${year}-${month}-${day}`);
      } catch (error) {
        return res.status(400).json({
          message: "Некорректный формат даты рождения (ожидается DD.MM.YYYY)",
        });
      }

      const student = await prisma.$transaction(async (tx) => {
        const existingStudent = await tx.student.findUnique({
          where: {
            iin: body.iin,
          },
        });

        if (existingStudent) {
          throw new Error("Студент с таким ИИНом уже существует");
        }

        const newStudent = await tx.student.create({
          data: {
            ei_contingent: body.ei_contingent,
            id_contingent: body.id_contingent,
            iin: body.iin,
            surname: body.surname,
            name: body.name,
            middlename: body.middlename,
            birthdate: isoDate,
            gender: body.gender,
            citizenship: body.citizenship,
            nationality: body.nationality,
          },
        });
        return newStudent;
      });

      res.status(201).json(student);
    } catch (error) {
      console.error(error);

      if (error.message === "Студент с таким ИИНом уже существует") {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: "Error in createStudent method" });
    }
  },
  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;

      let isoDate;
      try {
        const [day, month, year] = body.birthdate.split(".");
        isoDate = new Date(`${year}-${month}-${day}`);
      } catch (error) {
        return res.status(400).json({
          message: "Некорректный формат даты рождения (ожидается DD.MM.YYYY)",
        });
      }

      const student = await prisma.$transaction(async (tx) => {
        const existingStudent = await tx.student.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!existingStudent) {
          return res.status(404).json({ message: "Студент не найден" });
        }

        const updatedStudent = await tx.student.update({
          where: {
            id: Number(id),
          },
          data: {
            ei_contingent: body.ei_contingent,
            id_contingent: body.id_contingent,
            iin: body.iin,
            surname: body.surname,
            name: body.name,
            middlename: body.middlename,
            birthdate: isoDate,
            gender: body.gender,
            citizenship: body.citizenship,
            nationality: body.nationality,
          },
        });

        return updatedStudent;
      });

      res.status(200).json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in updateStudent method" });
    }
  },
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await prisma.$transaction(async (tx) => {
        const existingStudent = await tx.student.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!existingStudent) {
          return res.status(404).json({ message: "Студент не найден" });
        }

        const deletedStudent = await tx.student.delete({
          where: {
            id: Number(id),
          },
        });

        return deletedStudent;
      });
      res.status(200).json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in deleteStudent method" });
    }
  },
};

module.exports = {
  StudentController,
};
