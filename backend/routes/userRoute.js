import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/userModel.js';


const router = express.Router();

// Register route
router.post('/register',
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
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({  // Directly create the user with the plain password
        username,
        email,
        password,       // No hashing here
      });

      await user.save(); // Mongoose middleware will hash before saving

      const payload = { userId: user._id };
      const token = jwt.sign(payload, '32password!!@#$hellohibcdhcdbjk', { expiresIn: '1h' });

      res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });


// Login route



// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    // Include user information in the response
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username, email: user.email } }); // Include relevant user details

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;