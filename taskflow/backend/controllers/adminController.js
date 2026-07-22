const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const inMemoryDb = require('../services/inMemoryDb');

// @desc Get Admin Platform Stats & Users
// @route GET /api/admin/users
exports.getAdminData = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password');
      const totalTasks = await Task.countDocuments();
      return res.json({
        success: true,
        users,
        stats: {
          totalUsers: users.length,
          totalTasks,
          activeWorkspaces: 12,
          serverStatus: 'Healthy (MongoDB Atlas)'
        }
      });
    } else {
      const users = inMemoryDb.users.map(({ password, ...u }) => u);
      return res.json({
        success: true,
        users,
        stats: {
          totalUsers: users.length,
          totalTasks: inMemoryDb.tasks.length,
          activeWorkspaces: inMemoryDb.workspaces.length,
          serverStatus: 'Healthy (Autonomous Memory Node)'
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
