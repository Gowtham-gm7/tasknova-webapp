const mongoose = require('mongoose');
const Workspace = require('../models/Workspace');
const inMemoryDb = require('../services/inMemoryDb');

// @desc Get Workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (mongoose.connection.readyState === 1) {
      const workspaces = await Workspace.find({
        $or: [{ owner: userId }, { 'members.user': userId }]
      });
      return res.json({ success: true, workspaces });
    } else {
      const workspaces = inMemoryDb.workspaces.filter(ws =>
        ws.owner === userId || ws.members.some(m => m.user === userId)
      );
      return res.json({ success: true, workspaces });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Create Workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = (req.user._id || req.user.id).toString();
    const code = `TASK-${Math.floor(1000 + Math.random() * 9000)}`;

    if (mongoose.connection.readyState === 1) {
      const workspace = await Workspace.create({
        name,
        description,
        owner: userId,
        code,
        members: [{ user: userId, role: 'admin' }]
      });
      return res.status(201).json({ success: true, workspace });
    } else {
      const newWorkspace = {
        _id: `ws_${Date.now()}`,
        name,
        description: description || '',
        owner: userId,
        code,
        members: [{ user: userId, role: 'admin', joinedAt: new Date().toISOString() }],
        createdAt: new Date().toISOString()
      };
      inMemoryDb.workspaces.push(newWorkspace);
      return res.status(201).json({ success: true, workspace: newWorkspace });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
