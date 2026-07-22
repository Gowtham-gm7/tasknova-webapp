import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { TaskCard } from '../components/tasks/TaskCard';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Award, 
  Plus 
} from 'lucide-react';

export const DashboardPage = ({ onOpenTaskModal, onOpenAITaskModal, onEditTask }) => {
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);

  const todayStr = new Date().toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate && t.dueDate < todayStr).length;
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-brand-900/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-[11px] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Productivity Operating System
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, {user?.name || 'Alex'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            You have <span className="text-brand-400 font-bold">{todayTasks.length} tasks scheduled today</span> and {overdueTasks > 0 ? <span className="text-rose-400 font-bold">{overdueTasks} overdue items</span> : 'zero overdue deadlines'}. Keep momentum going!
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={onOpenAITaskModal}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition transform hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            Generate with AI
          </button>
          <button
            onClick={() => onOpenTaskModal()}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-2xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Quick Task
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Total Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">{totalTasks}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{completionPercentage}% Completed</span>
        </div>

        {/* Completed */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{completedTasks}</p>
          <span className="text-[10px] text-emerald-400/80 font-semibold">Great progress</span>
        </div>

        {/* Streak */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{user?.streak || 7} Days</p>
          <span className="text-[10px] text-amber-400/80 font-semibold">Personal Best!</span>
        </div>

        {/* Overdue */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className={`text-2xl font-black ${overdueTasks > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{overdueTasks}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Action required</span>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-400" />
            Today's Scheduled Focus ({todayTasks.length})
          </h3>
        </div>

        {todayTasks.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No tasks due today. Use the AI Task Generator to plan your schedule!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayTasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
