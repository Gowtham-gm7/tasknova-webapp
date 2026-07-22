import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Award, Lock, Flame, Zap, Trophy } from 'lucide-react';

export const BadgeShowcase = () => {
  const { user } = useContext(AuthContext);

  const allBadges = [
    { id: 'first_task', name: 'First Task', icon: '🏅', description: 'Completed your first productivity task' },
    { id: 'tasks_10', name: '10 Tasks Completed', icon: '⚡', description: 'Reached 10 completed tasks' },
    { id: 'tasks_100', name: '100 Tasks Completed', icon: '🚀', description: 'Mastered 100 completed tasks' },
    { id: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Maintained a 7-day productivity streak' },
    { id: 'productivity_master', name: 'Productivity Master', icon: '👑', description: 'Achieved a productivity score of 90+' }
  ];

  const unlockedIds = new Set((user?.badges || []).map(b => b.id));

  return (
    <div className="space-y-6 my-6 text-left">
      {/* Streak Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-indigo-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
            🔥
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-100">{user?.streak || 7} Day Productivity Streak!</h3>
            <p className="text-xs text-slate-300">You're on fire! Keep completing daily tasks to earn new achievement badges.</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-amber-400">{user?.productivityScore || 88}</span>
          <span className="text-[10px] block text-slate-400 font-bold uppercase">Productivity Index</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedIds.has(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition flex items-start gap-4 ${
                isUnlocked
                  ? 'glass-panel border-brand-500/40 shadow-xl shadow-brand-500/10'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                isUnlocked ? 'bg-brand-600/20 border border-brand-400/40' : 'bg-slate-900 border border-slate-800'
              }`}>
                {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-500" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-100">{badge.name}</h4>
                  {isUnlocked && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
