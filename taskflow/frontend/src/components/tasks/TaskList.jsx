import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { CheckCircle, Circle, Trash2, Edit3, Calendar, Tag, AlertTriangle, Copy } from 'lucide-react';

export const TaskList = ({ onEditTask }) => {
  const { tasks, updateTask, deleteTask, duplicateTask } = useContext(TaskContext);

  const priorityBadge = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 my-6">
        <p className="text-sm font-medium text-slate-400">No tasks found matching your current filter filters!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 my-4 text-left">
      <div className="divide-y divide-slate-800/80">
        {tasks.map((task) => {
          const isCompleted = task.status === 'Completed';
          const completedSub = (task.checklist || []).filter(s => s.completed).length;
          const totalSub = (task.checklist || []).length;

          return (
            <div
              key={task._id}
              className={`p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition group ${
                isCompleted ? 'bg-slate-950/40 opacity-70' : ''
              }`}
            >
              {/* Checkbox & Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => updateTask(task._id, { status: isCompleted ? 'Todo' : 'Completed' })}
                  className="text-slate-500 hover:text-emerald-400 transition shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4 className={`text-sm font-bold text-slate-200 truncate ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">{task.category}</span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {task.dueDate}
                      </span>
                    )}
                    {totalSub > 0 && (
                      <span className="text-brand-400 font-medium">
                        Subtasks: {completedSub}/{totalSub}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${priorityBadge[task.priority]}`}>
                  {task.priority}
                </span>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {task.status}
                </span>

                <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                  <button onClick={() => onEditTask(task)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => duplicateTask(task._id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
