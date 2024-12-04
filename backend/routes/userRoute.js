import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/userModel.js';


const router = express.Router();

// Register route
router.post('/register',
  [
    // Validation middleware to check that the fields are not empty or invalid
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body; // Destructure user inputs from request body

    try {
      // Check if user with the given email already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user (password will be hashed automatically in the mongoose pre-save middleware)
      user = new User({
        username,
        email,
        password, // No password hashing here; mongoose middleware will handle it
      });

      await user.save(); // Save the user to the database

      // Create JWT token with a payload containing user ID
      const payload = { userId: user._id };
      const token = jwt.sign(payload, '32password!!@#$hellohibcdhcdbjk', { expiresIn: '1h' }); // Secret key for JWT (can be moved to env variables for security)

      // Send back a success response with the token
      res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
      console.error("Registration error:", error); // Log any server errors
      res.status(500).json({ message: 'Server error' });
    }
  });


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if a user exists with the given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with the user's ID as payload
    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }); // Secret key for JWT (again, should be in env variables)

    // Return success response with the token and user details (optional)
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, username: user.username, email: user.email } // Optional: Include user details in response
    });

  } catch (error) {
    console.error("Login error:", error); // Log any server errors
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;