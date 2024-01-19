const Student = require("../models/Student.model");
const router = require("express").Router();

router.get("/", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).send({ error: "Failed to retrieve students" });
    });
});

//  GET /api/students/:studentId - Retrieves a specific student by id
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId).populate("cohort");
  res.json(student);
});

//  PUT /api/students/:studentId - Updates a specific student by id
router.put("/:studentId", (req, res) => {
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
      console.log("Error while updating student data".error);
      res.status(500).send({ error: "failed to update student" });
    });
});

//  DELETE /api/students/:studentId - Deletes a specific student by id
router.delete("/:studentId", (req, res) => {
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
      console.error("Error while deleting student by ID", error);
      res.status(500).json({ error: "failed to delete student" });
    });
});

router.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const newStudent = await Student.create(payload);
    res.status(201).json(newStudent);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).json({ error, message: "Duplicate somewhere" });
    } else {
      res
        .status(500)
        .json({ error, message: "Something happened maybe on the server" });
    }
  }
});
router.get("/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).send({ error: "Failed to retrieve students" });
    });
});
module.exports = router;
