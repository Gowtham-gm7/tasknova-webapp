const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryDb = require('../services/inMemoryDb');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026_antigravity');

    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      const user = inMemoryDb.users.find(u => u._id === decoded.id);
      if (user) {
        const { password, ...userWithoutPass } = user;
        req.user = userWithoutPass;
      }
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User account no longer exists' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access restricted to administrators' });
  }
};

module.exports = { protect, admin };
