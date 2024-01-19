require("dotenv").config();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isAuthenticated } = require("../middleware/route-guard.middleware");

const router = require("express").Router();

const SALT_ROUNDS = Math.floor(Math.random() * 15);
//sign up
router.post("/signup", async (req, res) => {
  const payload = req.body; //get name email password
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const passwordHash = bcrypt.hashSync(payload.passwordHash, salt); //encode the password
  const passwordHash = bcrypt.hashSync(payload.passwordHash, salt); //encode the password
  const userToRegister = {
    email: payload.email,
    name: payload.name,
    passwordHash,
  }; //register
  try {
    const newUser = await User.create(userToRegister);
    res.status(201).json({ message: "user has created an acount", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//login
router.post("/login", async (req, res) => {
  const payload = req.body; // email password
  try {
    const user = await User.findOne({
      email: payload.email.toLowerCase().trim(),
    });
    if (user) {
      // user try to authenticate
      if (bcrypt.compareSync(payload.password, user.passwordHash)) {
        //password match
        console.log(payload);
        const authToken = jwt.sign(
          {
            userId: user._id,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "2h",
          }
        );
        res.status(200).json({ token: authToken });
      } else {
        //password not match
        res.status(403).json({ message: "Incorrect password" });
      }
    } else {
      // user not matching the email
      res.status(404).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//verify

router.get("/verify", isAuthenticated, async (req, res) => {
  console.log(req.tokenPayload);
  const currentUser = await User.findById(req.tokenPayload.userId);
  res.status(200).json(currentUser);
});

module.exports = router;
