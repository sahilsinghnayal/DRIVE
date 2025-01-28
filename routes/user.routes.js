const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.get("/register", (req, res) => {
  res.render("register");
}); 

router.post(
  "/register",
  body("username").trim().isLength({ min: 3 }),
  body("email").trim().isEmail(),
  body("password").trim().isLength({ min: 5 }),

  async (req, res) => {
    const errors = validationResult(req);// explain this  line
    

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), messsage: "invalid data" });
    }

    console.log(errors);
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json(user);

    console.log(req.body);
    res.send("User registered");
  }
);
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), messsage: "invalid data" });
    }

    console.log(errors);
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user or password is incorrect " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "user or password is incorrect" });
    }
    const token = jwt.sign(
      { UserId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET
    );
    res.cookie("token", token);
    res.send("User logged in");
  }
);

module.exports = router;
