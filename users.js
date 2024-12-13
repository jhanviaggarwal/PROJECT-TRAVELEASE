const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const router = express.Router();

// File to store users
const USERS_FILE = "users.json";

// Helper to read users from file
const readUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    return JSON.parse(fs.readFileSync(USERS_FILE));
  } else {
    return [];
  }
};

// Helper to save users to file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Sign Up Route
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  // Check if email already exists
  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Hash the password before storing it
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "User created successfully" });
});

// Sign In Route
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare the hashed password
  const isMatch = bcrypt.compareSync(password, user.password);

  if (isMatch) {
    res.status(200).json({ message: "Sign In successful" });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});


 module.exports = router;

