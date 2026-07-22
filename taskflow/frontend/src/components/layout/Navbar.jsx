import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { TaskContext } from '../../context/TaskContext';
import { Sparkles, Sun, Moon, Search, Bell, Plus, User, LogOut, Download } from 'lucide-react';

export const Navbar = ({ onOpenAITaskModal, onOpenTaskModal, onOpenExportModal }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { searchQuery, setSearchQuery } = useContext(TaskContext);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, categories, or tags (Press '/' to focus)..."
          className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
        />
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center space-x-3">
        {/* Export Data */}
        <button
          onClick={onOpenExportModal}
          title="Export Task Data"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        {/* AI Task Assistant Launch Button */}
        <button
          onClick={onOpenAITaskModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
          AI Task Generator
        </button>

        {/* Quick Add Task Button */}
        <button
          onClick={() => onOpenTaskModal()}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Bell Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-700/60 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifications</h4>
                <span className="text-[10px] bg-brand-500/20 text-brand-400 font-semibold px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">🔥 7-Day Streak Maintained!</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Keep completing tasks daily to double your score.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">⏰ Deadline Reminder</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">TaskFlow Component UI is due in 3 hours.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="w-8 h-8 rounded-full ring-2 ring-brand-500/30 object-cover"
            />
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-slate-200 leading-none">{user.name}</p>
              <p className="text-[10px] text-brand-400 mt-1 font-medium">🔥 {user.streak || 7} Day Streak</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
