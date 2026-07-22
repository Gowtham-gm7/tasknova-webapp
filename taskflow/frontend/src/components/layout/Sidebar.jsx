import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Timer, 
  BarChart3, 
  Award, 
  Users, 
  ShieldCheck, 
  UserCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { label: 'Focus Room', path: '/focus', icon: Timer },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Badges & Streaks', path: '/badges', icon: Award },
    { label: 'Team Workspaces', path: '/workspaces', icon: Users },
    { label: 'My Profile', path: '/profile', icon: UserCircle }
  ];

  if (user && user.role === 'admin') {
    navItems.push({ label: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0f172a]/95 backdrop-blur-xl flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden md:flex">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              Task<span className="text-brand-500">Flow</span>
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">AI Productivity Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600/90 to-indigo-600/90 text-white shadow-md shadow-brand-500/20 border border-brand-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Productivity Score Widget */}
      <div className="p-4 m-4 rounded-2xl glass-card border border-brand-500/20 bg-gradient-to-br from-brand-900/30 to-slate-900/50 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300">Productivity Score</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-white">{user?.productivityScore || 88}</span>
          <span className="text-[10px] text-emerald-400 font-semibold">+12% vs last week</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-indigo-400 h-full rounded-full"
            style={{ width: `${user?.productivityScore || 88}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
