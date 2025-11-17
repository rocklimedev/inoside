// controller/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // use env var in production

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const newUser = await User.create({ name, username, email, password });

    const token = generateToken(newUser);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get logged-in user (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "username", "email", "createdAt"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};
