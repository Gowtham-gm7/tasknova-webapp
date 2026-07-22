import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskList } from '../components/tasks/TaskList';
import { Kanban, List, Plus, Filter, SortAsc, Sparkles } from 'lucide-react';

export const TasksPage = ({ onOpenTaskModal, onOpenAITaskModal, onEditTask }) => {
  const [viewMode, setViewMode] = useState('kanban'); // kanban or list
  const { 
    filterCategory, setFilterCategory, 
    filterPriority, setFilterPriority, 
    filterStatus, setFilterStatus,
    sortBy, setSortBy 
  } = useContext(TaskContext);

  return (
    <div className="space-y-6 text-left">
      {/* View Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-3xl border border-slate-800">
        {/* Toggle Kanban / List View */}
        <div className="inline-flex p-1 bg-slate-900 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'kanban' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'list' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List View
          </button>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Categories</option>
            {['Work', 'Personal', 'Study', 'College', 'Health', 'Finance', 'Shopping'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-brand-500"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </select>

          <button
            onClick={() => onOpenTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Main Task View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard onEditTask={onEditTask} onOpenTaskModal={onOpenTaskModal} />
      ) : (
        <TaskList onEditTask={onEditTask} />
      )}
    </div>
  );
};
