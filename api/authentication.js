const express = require("express");
const {Registervalidation,Loginvalidation} = require("../validation/user.validation");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Register } = require("../models");
const bcrypt = require("bcrypt");

const router = express.Router();
const SECRET_KEY = "JWT_SECRET"; // Replace with env variable

// 🔹 Register Route
router.post("/register",Registervalidation, async (req, res) => {
  try {
    const { name,number, email, password } = req.body;

    // Check if user exists
    var user = await Register.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    user = await Register.create({ name, number,email, password: hashedPassword });

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await Register.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user.login_id }, SECRET_KEY, { expiresIn: "5h" });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Protected Route
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.login_id, { attributes: [ "name","number","email","password"] });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
}

module.exports = router;
