const router = require("express").Router();
// Starting with /api
router.get("/", (req, res) => {
  res.json("All good in here");
});

const studentRouter = require("./student.routes");
router.use("/student", studentRouter);

const cohortRouter = require("./cohort.routes");
router.use("/cohort", cohortRouter);

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const userRouter = require("./users.routes");
router.use("/user", userRouter);

module.exports = router;
