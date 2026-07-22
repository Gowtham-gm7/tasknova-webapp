import React from 'react';
import { CheckSquare } from 'lucide-react';

export const SubtaskProgress = ({ checklist = [] }) => {
  if (!checklist || checklist.length === 0) return null;

  const completed = checklist.filter(s => s.completed).length;
  const total = checklist.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full mt-3">
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
        <span className="flex items-center gap-1 text-slate-300">
          <CheckSquare className="w-3.5 h-3.5 text-brand-400" />
          Subtasks ({completed}/{total})
        </span>
        <span className="font-semibold text-brand-400">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentage === 100
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-brand-500 to-indigo-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
