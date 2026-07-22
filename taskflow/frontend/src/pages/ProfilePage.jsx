import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { User, Mail, Shield, Save, Flame, Sparkles } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { showToast } = useContext(TaskContext);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 5);
  const [loading, setLoading] = useState(false);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, avatar, dailyGoal: Number(dailyGoal) });
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 text-left">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800 mb-6">
          <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full ring-4 ring-brand-500/30 object-cover" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block text-[10px] font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full mt-1">
              Role: {user?.role || 'user'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Choose Avatar Preset</label>
            <div className="flex gap-3">
              {avatars.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Preset ${idx}`}
                  onClick={() => setAvatar(imgUrl)}
                  className={`w-12 h-12 rounded-full cursor-pointer object-cover border-2 transition ${
                    avatar === imgUrl ? 'border-brand-500 scale-105 shadow-md' : 'border-transparent opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Task Goal Target</label>
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/25 transition"
            >
              <Save className="w-4 h-4" />
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
