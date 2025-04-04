const { StudentController } = require("../../controllers/student-controller");

const router = require("express").Router();

router.get("/getStudents", StudentController.getStudents);
router.get("/getStudent/:id", StudentController.getStudentById);
router.post("/createStudent", StudentController.createStudent);
router.put("/updateStudent/:id", StudentController.updateStudent);
router.delete("/deleteStudent/:id", StudentController.deleteStudent);

module.exports = router;
