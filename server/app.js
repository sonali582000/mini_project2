const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5005", "http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Route to view/docs.html
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// START SERVER

//Connect with DataBase

//  GET  /students - Retrieve all students from the database
app.get("/api/students", (req, res) => {
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
app.get("/api/students/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById(studentId).populate("cohort");
    res.json(student);
  } catch (error) {
    console.error("Error while retrieving students ->", error);
    res.status(500).send({ error: "Failed to retrieve students" });
  }
});

//  PUT /api/students/:studentId - Updates a specific student by id
app.put("/api/students/:studentId", (req, res) => {
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
app.delete("/api/students/:studentId", (req, res) => {
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

//  GET  /cohorts - Retrieve all cohorts from the database
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).send({ error: "Failed to retrieve cohorts" });
    });
});

// POST /api/students - Creates a new student
app.post("/api/students", async (req, res) => {
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

//Create new Cohort
app.post("/api/cohorts", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  try {
    const newCohort = await Cohort.create(payload);
    res.status(201).json(newCohort);
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

//get one Cohort with ID
app.get("/api/cohorts/:cohortId", async (req, res) => {
  const { cohortId } = req.params;
  try {
    const oneCohort = await Cohort.findById(cohortId);
    res.json(oneCohort);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Something happened maybe on the server" });
  }
});

//Update Cohort
app.put("/api/cohorts/:cohortId", async (req, res) => {
  const payload = req.body;
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      payload,
      { new: true }
    );
    res.status(202).json(updatedCohort);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Something bad happened" });
  }
});

//Delete Cohort from DB
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  const { cohortId } = req.params;
  try {
    const cohortDel = await Cohort.findByIdAndDelete(cohortId);
    res
      .status(202)
      .json({ message: `${cohortDel.title} was removed from database` });
  } catch (error) {
    console.log(error);
  }
});

// GET /api/students - Retrieves all of the students in the database collection
app.get("/api/students", (req, res) => {
  Student.find()
    .then((allStudents) => {
      res.status(200).json(allStudents);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error getting all students" });
    });
});

//GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {
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
module.exports = app;
