import React, { useState, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { Users, Plus, Code, UserPlus } from 'lucide-react';

export const WorkspaceManager = () => {
  const { showToast } = useContext(TaskContext);
  const [workspaces, setWorkspaces] = useState([
    {
      _id: 'ws_1',
      name: 'Product & Design Team',
      description: 'Core product engineering & UI design workspace',
      code: 'TASK-8821',
      membersCount: 4
    },
    {
      _id: 'ws_2',
      name: 'Personal Goals & Life',
      description: 'Personal habit tracking, health & fitness goals',
      code: 'LIFE-3419',
      membersCount: 1
    }
  ]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newWs = {
      _id: `ws_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom team workspace',
      code: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      membersCount: 1
    };
    setWorkspaces([newWs, ...workspaces]);
    showToast('Workspace created successfully!');
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 my-6 text-left">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-400" />
          Create Team Workspace
        </h3>
        <p className="text-xs text-slate-400 mb-4">Collaborate on projects, assign tasks, and track activity live.</p>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace Name (e.g. Frontend Team)"
            className="bg-slate-900 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short Description"
            className="bg-slate-900 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Create Workspace
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => (
          <div key={ws._id} className="glass-panel p-5 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-100">{ws.name}</h4>
              <span className="text-[10px] font-mono bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Code className="w-3 h-3" />
                {ws.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">{ws.description}</p>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
              <span className="text-slate-400 font-medium">Members: {ws.membersCount}</span>
              <button
                onClick={() => showToast(`Invite code ${ws.code} copied to clipboard!`)}
                className="flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:text-brand-300"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Invite Member
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
