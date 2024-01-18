const Cohort = require("../models/Cohort.model");
const router = require('express').Router()


//  GET  /cohorts - Retrieve all cohorts from the database
router.get("/", (req, res) => {
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
  
  
  
  //Create new Cohort
  router.post("/", async (req, res) => {
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
  
  //get one Cohort with ID
  router.get("/:cohortId", async (req, res) => {
    const { cohortId } = req.params;
    const oneCohort = await Cohort.findById(cohortId);
    res.json(oneCohort);
  });
  
  //Update Cohort
  router.put("/:cohortId", async (req, res) => {
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
  router.delete("/:cohortId", async (req, res) => {
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
  module.exports = router