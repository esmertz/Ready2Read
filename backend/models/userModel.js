import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for the User model
const userSchema = mongoose.Schema(
  {
    // The username field is required and must be unique
    username: {
      type: String,
      required: true,
      unique: true,
    },

    // The email field is required, must be unique, and must match a simple email format
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },

    // The password field is required
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

// Middleware to hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  // Check if the password has been modified
  if (this.isModified('password')) {
    // Hash the password using bcrypt with a salt rounds of 10
    this.password = await bcrypt.hash(this.password, 10);
  }
  // Proceed to save the document
  next();
});

// Method to compare the entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (password) {
  // Use bcrypt's compare method to check if the entered password matches the hashed password
  return await bcrypt.compare(password, this.password);
};

// Post hook for handling the login route (Note: This is incorrect as post hooks don't exist in mongoose)
// Instead, login logic should be implemented in a separate controller or route handler
userSchema.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });
    // If no user is found, send a 401 Unauthorized response
    if (!user) {
      console.log('User not found'); // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches the stored hash
    const isMatch = await user.matchPassword(password);

    console.log('Password Match:', isMatch); // Debugging log (true or false)

    // If the password doesn't match, send a 401 Unauthorized response
    if (!isMatch) {
      console.log('Password mismatch'); // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If credentials are valid, generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful for:', email); // Debugging log
    // Send the generated token as the response
    res.json({ token });
  } catch (error) {
    // If there is an error, log it and send a 500 Internal Server Error response
    console.error('Login error:', error); // Debugging log
    res.status(500).json({ message: 'Server error' });
  }
});

// Define and export the User model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model to be used in other parts of the application
export default User;
