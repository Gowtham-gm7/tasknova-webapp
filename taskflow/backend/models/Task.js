const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Work' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Review', 'Completed'], default: 'Todo' },
  dueDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  dueTime: { type: String, default: '18:00' },
  estimatedTime: { type: Number, default: 30 }, // in minutes
  tags: [{ type: String }],
  labels: [{ type: String }],
  checklist: [SubtaskSchema],
  notes: { type: String, default: '' },
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isArchived: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);
