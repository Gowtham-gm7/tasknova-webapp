import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { FileSpreadsheet, FileText, Download, X } from 'lucide-react';

export const ExportModal = ({ isOpen, onClose }) => {
  const { tasks } = useContext(TaskContext);

  if (!isOpen) return null;

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'DueDate', 'SubtasksCompleted'];
    const rows = tasks.map(t => [
      t._id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.dueDate,
      `${(t.checklist || []).filter(s => s.completed).length}/${(t.checklist || []).length}`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TaskFlow_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const exportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(tasks, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `TaskFlow_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-700/70 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-400" />
            Export Task Repository
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 my-4">
          Export your complete set of {tasks.length} tasks into structured spreadsheets or JSON developer formats.
        </p>

        <div className="space-y-3">
          <button
            onClick={exportCSV}
            className="w-full flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 hover:border-brand-500/50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Export as CSV / Excel</p>
                <p className="text-[10px] text-slate-400">Compatible with Microsoft Excel & Google Sheets</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
          </button>

          <button
            onClick={exportJSON}
            className="w-full flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 hover:border-brand-500/50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Export as JSON Backup</p>
                <p className="text-[10px] text-slate-400">Full schema backup with subtasks & attachments</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
