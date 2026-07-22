import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';
import { ShieldCheck, Users, CheckSquare, Server } from 'lucide-react';

export const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);

  const mockUsers = [
    {
      _id: 'usr_1',
      name: user?.name || 'Alex Rivera',
      email: user?.email || 'alex@taskflow.io',
      role: 'admin',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      streak: user?.streak || 7,
      productivityScore: user?.productivityScore || 88
    },
    {
      _id: 'usr_2',
      name: 'Sarah Chen',
      email: 'sarah@taskflow.io',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      streak: 12,
      productivityScore: 94
    }
  ];

  return (
    <div className="space-y-6 my-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-brand-400" />
            <div>
              <p className="text-xs text-slate-400">Total Active Users</p>
              <h3 className="text-xl font-bold text-slate-100">{mockUsers.length}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Stored Tasks</p>
              <h3 className="text-xl font-bold text-slate-100">{tasks.length}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400">Execution Engine</p>
              <h3 className="text-xs font-bold text-emerald-400 mt-1">Standalone Browser Engine</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-4">Platform User Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2 text-left">User</th>
                <th className="py-2 text-left">Email</th>
                <th className="py-2 text-left">Role</th>
                <th className="py-2 text-left">Streak</th>
                <th className="py-2 text-left">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockUsers.map((u) => (
                <tr key={u._id}>
                  <td className="py-3 font-semibold text-slate-100 flex items-center gap-2">
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    {u.name}
                  </td>
                  <td className="py-3 text-slate-400">{u.email}</td>
                  <td className="py-3">
                    <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-amber-400">{u.streak} Days</td>
                  <td className="py-3 font-bold text-emerald-400">{u.productivityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
