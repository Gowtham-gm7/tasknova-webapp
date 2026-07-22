const mongoose = require('mongoose');
const Task = require('../models/Task');
const inMemoryDb = require('../services/inMemoryDb');

// @desc Get User Productivity Analytics
// @route GET /api/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    let tasks = [];

    if (mongoose.connection.readyState === 1) {
      tasks = await Task.find({ user: userId });
    } else {
      tasks = inMemoryDb.tasks.filter(t => t.user === userId || t.user === 'usr_demo_1');
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'Todo').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate && t.dueDate < todayStr).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Category Distribution
    const categoryCounts = {};
    tasks.forEach(t => {
      const cat = t.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Priority Breakdown
    const priorityCounts = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(t => {
      if (priorityCounts[t.priority] !== undefined) {
        priorityCounts[t.priority]++;
      }
    });

    // Weekly completion progress mock / actual calculation
    const weeklyData = [
      { day: 'Mon', completed: 4, created: 5 },
      { day: 'Tue', completed: 6, created: 4 },
      { day: 'Wed', completed: 5, created: 6 },
      { day: 'Thu', completed: 8, created: 7 },
      { day: 'Fri', completed: 7, created: 5 },
      { day: 'Sat', completed: 3, created: 2 },
      { day: 'Sun', completed: 5, created: 3 }
    ];

    res.json({
      success: true,
      analytics: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate,
        streak: req.user.streak || 7,
        productivityScore: req.user.productivityScore || 88,
        categoryCounts,
        priorityCounts,
        weeklyData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
