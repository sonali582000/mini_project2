require("dotenv").config();
const { isAuthenticated } = require("../middleware/route-guard.middleware");
const User = require("../models/User.model");
const router = require("express").Router();

router.get("/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentUser = await User.findById(req.tokenPayload.userId);
    res.status(200).json(currentUser);
    // const user = await User.findById(id);
    // res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
