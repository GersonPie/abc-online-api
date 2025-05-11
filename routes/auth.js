const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  console.log('Register request:', req.body); // Debug log

  try {
    const { name, phone, password, email } = req.body;

    // Validate required fields
    if (!name || !phone || !password || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({ message: "Email já foi registado" });
    }
    else console.log("User does not exist, proceeding with registration");

    // Hash password and save user
    
    const user = new User({ name, phone, password, email });
    await user.save();

    console.log("User created:", user);
    res.status(201).json({ message: "Registado com sucesso" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciais Invalidos' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Palava-passe errada' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
    console.log("User logged in:", user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//test DB
router.get('/test', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Protected Route
router.get('/profile', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    // Find user without password field
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only necessary user data
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone
    });

  } catch (err) {
    console.error('Profile error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/adminLogin', async (req, res) => {
  var user = null;
  try {
    const { email, password } = req.body;
    user = {
      email,
      password 
    }
    console.log('Admin login request:', req.body); // Debug log
    if(email === "AbcOnline" && password === "21abc-ca3112@online") {
        const token = jwt.sign({ id: "admin" }, process.env.JWT_SECRET, { expiresIn: '10min' });
    res.json({ token, user: { id: "admin", name: user.name, phone: user.phone } });
    console.log("User logged in:", user);
  
      return res.status(200).json({ message: "Login successful" });
    }
    else{
        return res.status(401).json({ message: "Credênciais Invalidos" });
    }
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
    
});

module.exports = router;