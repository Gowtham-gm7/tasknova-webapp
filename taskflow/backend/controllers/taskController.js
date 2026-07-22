const mongoose = require('mongoose');
const Task = require('../models/Task');
const inMemoryDb = require('../services/inMemoryDb');
const BadgeService = require('../services/badgeService');

// @desc    Get All Tasks (with search, filter, sort)
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { search, category, priority, status, workspaceId, archived } = req.query;
    const userId = (req.user._id || req.user.id).toString();

    if (mongoose.connection.readyState === 1) {
      let query = { user: userId };
      if (archived === 'true') {
        query.isArchived = true;
      } else {
        query.isArchived = false;
      }

      if (category && category !== 'All') query.category = category;
      if (priority && priority !== 'All') query.priority = priority;
      if (status && status !== 'All') query.status = status;
      if (workspaceId) query.workspace = workspaceId;

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: tasks.length, tasks });
    } else {
      let filtered = inMemoryDb.tasks.filter(t => {
        const matchesUser = t.user === userId || t.user === 'usr_demo_1';
        const matchesArchive = archived === 'true' ? t.isArchived === true : !t.isArchived;
        return matchesUser && matchesArchive;
      });

      if (category && category !== 'All') {
        filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
      }
      if (priority && priority !== 'All') {
        filtered = filtered.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
      }
      if (status && status !== 'All') {
        filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
      }
      if (workspaceId) {
        filtered = filtered.filter(t => t.workspace === workspaceId);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(s) || 
          (t.description && t.description.toLowerCase().includes(s)) ||
          (t.tags && t.tags.some(tag => tag.toLowerCase().includes(s)))
        );
      }

      return res.json({ success: true, count: filtered.length, tasks: filtered });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create Single Task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const taskData = {
      ...req.body,
      user: userId,
      checklist: req.body.checklist || [],
      tags: req.body.tags || [],
      labels: req.body.labels || []
    };

    if (mongoose.connection.readyState === 1) {
      const task = await Task.create(taskData);
      return res.status(201).json({ success: true, task });
    } else {
      const newTask = {
        _id: `task_${Date.now()}`,
        ...taskData,
        status: taskData.status || 'Todo',
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryDb.tasks.unshift(newTask);
      return res.status(201).json({ success: true, task: newTask });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update Task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = (req.user._id || req.user.id).toString();

    if (mongoose.connection.readyState === 1) {
      let task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

      if (req.body.status === 'Completed' && task.status !== 'Completed') {
        req.body.completedAt = new Date();
      }

      task = await Task.findByIdAndUpdate(taskId, { ...req.body, updatedAt: Date.now() }, { new: true });
      return res.json({ success: true, task });
    } else {
      const index = inMemoryDb.tasks.findIndex(t => t._id === taskId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Task not found' });

      if (req.body.status === 'Completed' && inMemoryDb.tasks[index].status !== 'Completed') {
        req.body.completedAt = new Date().toISOString();
      }

      inMemoryDb.tasks[index] = {
        ...inMemoryDb.tasks[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      // Check badges for completed tasks
      const completedTasks = inMemoryDb.tasks.filter(t => t.status === 'Completed');
      const newBadges = BadgeService.evaluateBadges({
        completedCount: completedTasks.length,
        streak: req.user.streak || 7,
        productivityScore: req.user.productivityScore || 88,
        existingBadges: req.user.badges || []
      });

      if (newBadges.length > 0) {
        req.user.badges = [...(req.user.badges || []), ...newBadges];
      }

      return res.json({ success: true, task: inMemoryDb.tasks[index], newBadges });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (mongoose.connection.readyState === 1) {
      await Task.findByIdAndDelete(taskId);
    } else {
      inMemoryDb.tasks = inMemoryDb.tasks.filter(t => t._id !== taskId);
    }
    return res.json({ success: true, message: 'Task successfully deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Toggle Subtask Status
// @route   PATCH /api/tasks/:id/subtask/:subtaskId
exports.toggleSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

      const subtask = task.checklist.id(subtaskId);
      if (subtask) subtask.completed = !subtask.completed;
      await task.save();
      return res.json({ success: true, task });
    } else {
      const task = inMemoryDb.tasks.find(t => t._id === id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

      const sub = task.checklist.find(s => s._id === subtaskId);
      if (sub) sub.completed = !sub.completed;
      return res.json({ success: true, task });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Duplicate Task
// @route   POST /api/tasks/:id/duplicate
exports.duplicateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = (req.user._id || req.user.id).toString();

    if (mongoose.connection.readyState === 1) {
      const existing = await Task.findById(taskId);
      if (!existing) return res.status(404).json({ success: false, message: 'Task not found' });

      const copy = existing.toObject();
      delete copy._id;
      copy.title = `${copy.title} (Copy)`;
      copy.status = 'Todo';
      copy.createdAt = new Date();

      const newTask = await Task.create(copy);
      return res.status(201).json({ success: true, task: newTask });
    } else {
      const existing = inMemoryDb.tasks.find(t => t._id === taskId);
      if (!existing) return res.status(404).json({ success: false, message: 'Task not found' });

      const newTask = {
        ...JSON.parse(JSON.stringify(existing)),
        _id: `task_${Date.now()}`,
        title: `${existing.title} (Copy)`,
        status: 'Todo',
        createdAt: new Date().toISOString()
      };

      inMemoryDb.tasks.unshift(newTask);
      return res.status(201).json({ success: true, task: newTask });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
