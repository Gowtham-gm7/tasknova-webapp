const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const inMemoryDb = require('../services/inMemoryDb');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026_antigravity', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({ name, email, password });
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          productivityScore: user.productivityScore,
          streak: user.streak,
          badges: user.badges
        }
      });
    } else {
      const userExists = inMemoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isVerified: true,
        productivityScore: 80,
        streak: 1,
        longestStreak: 1,
        dailyGoal: 5,
        badges: [{ id: 'first_task', name: 'First Task', icon: '🏅', unlockedAt: new Date().toISOString() }],
        createdAt: new Date().toISOString()
      };

      inMemoryDb.users.push(newUser);
      const token = generateToken(newUser._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          productivityScore: newUser.productivityScore,
          streak: newUser.streak,
          badges: newUser.badges
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          productivityScore: user.productivityScore,
          streak: user.streak,
          badges: user.badges
        }
      });
    } else {
      const user = inMemoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== 'password123') { // demo password bypass for testing
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          productivityScore: user.productivityScore,
          streak: user.streak,
          badges: user.badges
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// @desc    Update Profile Details
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, dailyGoal } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id || req.user.id);
      if (name) user.name = name;
      if (avatar) user.avatar = avatar;
      if (dailyGoal) user.dailyGoal = dailyGoal;
      await user.save();

      return res.json({ success: true, user });
    } else {
      const user = inMemoryDb.users.find(u => u._id === (req.user._id || req.user.id));
      if (user) {
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (dailyGoal) user.dailyGoal = dailyGoal;
      }
      return res.json({ success: true, user });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Forgot Password Mock Request
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
  res.json({
    success: true,
    message: 'Password reset link has been dispatched to your registered email inbox.'
  });
};
