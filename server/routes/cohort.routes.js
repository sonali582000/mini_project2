const Cohort = require("../models/Cohort.model");
const router = require("express").Router();

//  GET  /cohorts - Retrieve all cohorts from the database
router.get("/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.status(200).json(cohorts);
  } catch (error) {
    next(error);
  }
});

//Create new Cohort
router.post("/cohorts", async (req, res, next) => {
  const payload = req.body;
  console.log(payload);
  try {
    const newCohort = await Cohort.create(payload);
    res.status(201).json(newCohort);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//get one Cohort with ID
router.get("/cohorts/:cohortId", async (req, res) => {
  const { cohortId } = req.params;
  const oneCohort = await Cohort.findById(cohortId);
  res.json(oneCohort);
});

//Update Cohort
router.put("/cohorts/:cohortId", async (req, res, next) => {
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
    next(error);
  }
});

//Delete Cohort from DB
router.delete("/cohorts/:cohortId", async (req, res, next) => {
  const { cohortId } = req.params;
  try {
    const cohortDel = await Cohort.findByIdAndDelete(cohortId);
    res
      .status(202)
      .json({ message: `${cohortDel.title} was removed from database` });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
