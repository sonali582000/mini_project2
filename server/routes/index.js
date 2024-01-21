const router = require("express").Router();
// Starting with /api
router.get("/", (req, res) => {
  res.json("All good in here");
});

module.exports = router;
