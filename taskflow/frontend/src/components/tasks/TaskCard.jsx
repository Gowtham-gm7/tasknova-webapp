import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { SubtaskProgress } from './SubtaskProgress';
import { Calendar, Clock, Copy, Trash2, Edit3, Tag, CheckCircle, AlertTriangle } from 'lucide-react';

export const TaskCard = ({ task, onEdit }) => {
  const { updateTask, deleteTask, duplicateTask } = useContext(TaskContext);

  const priorityColors = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const categoryColors = {
    Work: 'bg-indigo-500/20 text-indigo-300',
    Personal: 'bg-pink-500/20 text-pink-300',
    Study: 'bg-blue-500/20 text-blue-300',
    College: 'bg-purple-500/20 text-purple-300',
    Health: 'bg-emerald-500/20 text-emerald-300',
    Finance: 'bg-amber-500/20 text-amber-300',
    Shopping: 'bg-rose-500/20 text-rose-300'
  };

  const isCompleted = task.status === 'Completed';
  const isOverdue = !isCompleted && task.dueDate && task.dueDate < new Date().toISOString().split('T')[0];

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`glass-card p-4 rounded-2xl cursor-grab active:cursor-grabbing text-left relative group ${
        isCompleted ? 'opacity-70 bg-slate-900/30' : ''
      }`}
    >
      {/* Priority & Category Badges */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.Medium}`}>
            {task.priority}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[task.category] || 'bg-slate-800 text-slate-300'}`}>
            {task.category}
          </span>
        </div>

        {/* Quick Card Action Buttons */}
        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Edit Task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => duplicateTask(task._id)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400"
            title="Duplicate Task"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 className={`text-sm font-bold text-slate-100 mb-1 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-2 font-normal">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="text-[9px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 text-brand-400" />
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtask Progress Component */}
      <SubtaskProgress checklist={task.checklist} />

      {/* Due Date & Quick Status Toggle */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-400 font-semibold' : ''}`}>
          {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5 text-slate-500" />}
          <span>{task.dueDate || 'No Date'}</span>
          {task.dueTime && <span className="text-[10px] text-slate-500">({task.dueTime})</span>}
        </div>

        <button
          onClick={() => updateTask(task._id, { status: isCompleted ? 'Todo' : 'Completed' })}
          className={`flex items-center gap-1 font-semibold text-[10px] px-2 py-1 rounded-lg transition ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'hover:bg-brand-500/20 text-slate-400 hover:text-brand-300'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          {isCompleted ? 'Done' : 'Mark Done'}
        </button>
      </div>
    </div>
  );
};
