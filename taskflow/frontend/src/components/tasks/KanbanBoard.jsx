import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const KanbanBoard = ({ onEditTask, onOpenTaskModal }) => {
  const { tasks, updateTask } = useContext(TaskContext);

  const columns = [
    { id: 'Todo', title: 'To Do', color: 'border-blue-500/50 text-blue-400 bg-blue-500/10' },
    { id: 'In Progress', title: 'In Progress', color: 'border-amber-500/50 text-amber-400 bg-amber-500/10' },
    { id: 'Review', title: 'In Review', color: 'border-purple-500/50 text-purple-400 bg-purple-500/10' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status: targetStatus });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
      {columns.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="glass-panel p-4 rounded-3xl flex flex-col min-h-[500px] border border-slate-800/80"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color.split(' ')[2]}`} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{col.title}</h4>
                <span className="text-[11px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onOpenTaskModal(col.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={`Add ${col.title} task`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {colTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs p-4">
                  Drag tasks here or click '+' to create
                </div>
              ) : (
                colTasks.map((t) => (
                  <TaskCard key={t._id} task={t} onEdit={onEditTask} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
