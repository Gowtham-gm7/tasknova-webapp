import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { X, Plus, Trash2, CheckSquare, Calendar, Clock, Tag, FileText, CheckCircle } from 'lucide-react';

export const TaskModal = ({ isOpen, onClose, initialTask = null, defaultStatus = 'Todo' }) => {
  const { addTask, updateTask } = useContext(TaskContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('18:00');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [tagsInput, setTagsInput] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setCategory(initialTask.category || 'Work');
      setPriority(initialTask.priority || 'Medium');
      setStatus(initialTask.status || 'Todo');
      setDueDate(initialTask.dueDate || '');
      setDueTime(initialTask.dueTime || '18:00');
      setEstimatedTime(initialTask.estimatedTime || 30);
      setTagsInput((initialTask.tags || []).join(', '));
      setChecklist(initialTask.checklist || []);
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('Medium');
      setStatus(defaultStatus || 'Todo');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('18:00');
      setEstimatedTime(30);
      setTagsInput('');
      setChecklist([]);
      setNotes('');
    }
  }, [initialTask, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setChecklist([...checklist, { _id: `sub_${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (index) => {
    const updated = [...checklist];
    updated[index].completed = !updated[index].completed;
    setChecklist(updated);
  };

  const handleRemoveSubtask = (index) => {
    setChecklist(checklist.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: title.trim(),
      description,
      category,
      priority,
      status,
      dueDate,
      dueTime,
      estimatedTime: Number(estimatedTime),
      tags,
      checklist,
      notes
    };

    if (initialTask) {
      await updateTask(initialTask._id, payload);
    } else {
      await addTask(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-700/70 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100">
            {initialTask ? 'Edit Task Details' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build React Navbar Component"
              className="w-full bg-slate-900/90 text-sm text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about the task output..."
              className="w-full bg-slate-900/90 text-sm text-slate-100 rounded-xl px-3.5 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Priority, Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                {['Work', 'Personal', 'Study', 'College', 'Health', 'Finance', 'Shopping'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Dates & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Time (Minutes)</label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Subtask Checklist */}
          <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-brand-400" />
                Subtask Checklist ({checklist.length})
              </span>
            </div>

            <div className="space-y-1.5 mb-2">
              {checklist.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(idx)}
                      className="text-slate-500 hover:text-emerald-400"
                    >
                      {sub.completed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 border border-slate-600 rounded" />}
                    </button>
                    <span className={sub.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {sub.title}
                    </span>
                  </div>
                  <button type="button" onClick={() => handleRemoveSubtask(idx)} className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask title..."
                className="flex-1 bg-slate-900 text-xs text-slate-200 rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Frontend, React, Priority"
              className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3.5 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Rich Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Notes & Links</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional documentation, links, or instructions..."
              className="w-full bg-slate-900/90 text-xs text-slate-200 rounded-xl px-3.5 py-2 border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Form Submit */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
