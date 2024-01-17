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

/*app.get("/api/cohorts", (req, res) => {
  res.json(cohorts);
});*/

/*app.get("/api/students", (req, res) => {
  res.json(students);
});*/

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

app.post('/api/cohorts', async (req, res) => {
  const payload = req.body
  console.log(payload)
  try {
    const newCohort = await Cohort.create(payload)

    res.status(201).json(newCohort)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      response.status(400).json({ error, message: 'Duplicate somewhere' })
    } else {
      response.status(500).json({ error, message: 'Something happened maybe on the server' })
    }
  }
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  const { cohortId } = req.params;

  const oneCohort = await Cohort.findById(cohortId)
  res.json(oneCohort)
});

app.put("/api/cohorts/:cohortId", async (req, res) => {

  const payload = req.body

  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(req.params.cohortId, payload, { new: true })
    res.status(202).json(updatedCohort)
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: 'Something bad happened' })
  }
});

app.delete('/api/cohorts/:cohortId', async (req, res) => {
  const {cohortId} = req.params;
  try {
    const cohortDel = await Cohort.findByIdAndDelete(cohortId);
    res.status(202).json({message: `${cohortDel.title} was removed from database`})
  } catch (error) {
    console.log(error)
  }
})



