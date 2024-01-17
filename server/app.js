const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;

const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

//const cohorts = require("./cohorts.json");
//const students = require("./students.json");

const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ["http://localhost:5005", "http://localhost:5173"], // Add the URLs of allowed origins to this array
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//DataBase
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

//  GET  /students - Retrieve all students from the database
app.get("/api/students", (req, res) => {
  Student.find({})
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

  const student = await Student.findById(studentId);
  res.json(student);
});
/*
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      console.log("Retrived student by ID ", student);
      res.json(student);
    })
    .catch((error) => {
      console.log("Error while retreiving student by ID", error);
      res.status(500).send({ error: "failed to retrieve student" });
    });
    */

//  PUT /api/students/:studentId - Updates a specific student by id
app.put("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const updatedStudentData = req.body;

  Student.findByIdAndUpdate(studentId, updatedStudentData, { new: true }) //findByIdAndUpdate(id, update, options, callback)
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
    // Create the Student
    const newStudent = await Student.create(payload);
    // return the new Student into the response
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

app.post("/api/cohorts", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  try {
    const newCohort = await Cohort.create(payload);

    res.status(201).json(newCohort);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      response.status(400).json({ error, message: "Duplicate somewhere" });
    } else {
      response
        .status(500)
        .json({ error, message: "Something happened maybe on the server" });
    }
  }
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  const { cohortId } = req.params;

  const oneCohort = await Cohort.findById(cohortId);
  res.json(oneCohort);
});

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
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).send({ error: "Failed to retrieve students" });
    });
});
