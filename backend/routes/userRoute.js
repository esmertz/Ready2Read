import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/userModel.js';

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save user to database
      await newUser.save();

      // Generate JWT token
      const payload = {
        userId: newUser._id,
      };

      const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// Login route
router.post(
    '/login',
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          console.log("User not found:", email);  // Debugging line
          return res.status(400).json({ message: 'Invalid credentials' });
        }
  
        // Check if password matches using matchPassword method
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          console.log("Password mismatch for user:", email);  // Debugging line
          return res.status(400).json({ message: 'Invalid credentials' });
        }
  
        // If password matches, generate JWT token
        const payload = {
          userId: user._id,
        };
  
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
        console.log("JWT Token generated:", token);  // Debugging line
  
        res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        console.error("Error during login:", error);  // Debugging line
        res.status(500).json({ message: 'Server error' });
      }
    }
  );
  
  
  

export default router;
