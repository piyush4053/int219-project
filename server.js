const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Create a Mongoose Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create a Mongoose Model
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON requests
app.use(express.static('public'))
app.use(bodyParser.json());

// Route to handle user signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Create a new user
  const newUser = new User({ username, password });
  await newUser.save();

  res.status(201).json({ message: 'Signup successful' });
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Check if password is correct
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
