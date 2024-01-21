const Student = require("../models/Student.model");
const router = require("express").Router();

router.get("/students", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    console.log("Retrieved students ->", students);
    res.json(students);
  } catch (error) {
    next(error);
    console.error("Error while retrieving students ->", error);
  }
});

//  GET /api/students/:studentId - Retrieves a specific student by id
router.get("/students/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId).populate("cohort");
  res.json(student);
});

//  PUT /api/students/:studentId - Updates a specific student by id
router.put("/students/:studentId", (req, res, next) => {
  const studentId = req.params.studentId;
  const updatedStudentData = req.body;
  Student.findByIdAndUpdate(studentId, updatedStudentData, { new: true })
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).json({ error: "student not found" });
      }
      console.log("updated student by ID", updatedStudent);
      res.json(updatedStudent);
    })
    .catch((error) => {
      next(error);
      console.log("Error while updating student data".error);
    });
});

//  DELETE /api/students/:studentId - Deletes a specific student by id
router.delete("/students/:studentId", (req, res, next) => {
  const studentId = req.params.studentId;

  Student.findByIdAndDelete(studentId)
    .then((deleteStudent) => {
      if (!deleteStudent) {
        return res.status(404).json({ error: "student not found" });
      }
      console.log("delete student by ID", deleteStudent);
      res.json({ message: "student deleted successfully" });
    })
    .catch((error) => {
      next(error);
      console.error("Error while deleting student by ID", error);
    });
});

router.post("/students", async (req, res, next) => {
  const payload = req.body;
  try {
    const newStudent = await Student.create(payload);
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
    console.log(error);
  }
});
router.get("/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      next(error);
      console.error("Error while retrieving students ->", error);
    });
});
module.exports = router;
