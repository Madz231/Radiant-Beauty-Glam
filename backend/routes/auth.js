

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const User = require('../models/User');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateUserInput({ username, email, password }) {
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return 'Username must be at least 3 characters long.';
  }
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

// REGISTER CUSTOMER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const validationError = validateUserInput({ username, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username: username.trim(), email: email.toLowerCase().trim(), password: hashedPassword, role: 'customer' });
    await user.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
});

// REGISTER ADMIN (admin-only)
router.post('/register-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const validationError = validateUserInput({ username, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const adminUser = new User({ username: username.trim(), email: email.toLowerCase().trim(), password: hashedPassword, role: 'admin' });
    await adminUser.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Admin registration failed. Please try again later.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'JWT secret not configured' });

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '2h' });
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
});

module.exports = router;
