import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


userSchema.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging line
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if passwords match
    const isMatch = await user.matchPassword(password);

    console.log('Password Match:', isMatch); // Should log true or false

    if (!isMatch) {
      console.log('Password mismatch'); // Debugging line
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and respond
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for:', email); // Debugging line
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error); // Debugging line
    res.status(500).json({ message: 'Server error' });
  }
});


const User = mongoose.model('User', userSchema);

// Correct export for ES6 modules
export default User;
