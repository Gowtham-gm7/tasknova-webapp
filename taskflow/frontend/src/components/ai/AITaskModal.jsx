import React, { useState, useContext } from 'react';
import { parseNaturalLanguageTask } from '../../services/aiParser';
import { TaskContext } from '../../context/TaskContext';
import { Sparkles, Loader2, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const AITaskModal = ({ isOpen, onClose }) => {
  const { addTask, showToast } = useContext(TaskContext);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTask, setGeneratedTask] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const taskObj = parseNaturalLanguageTask(prompt);
      setGeneratedTask(taskObj);
      setLoading(false);
    }, 400);
  };

  const handleConfirmTask = async () => {
    if (!generatedTask) return;
    await addTask(generatedTask);
    showToast('AI Task successfully created! 🚀');
    setGeneratedTask(null);
    setPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-indigo-500/30 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-slate-100">AI Task Generator</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!generatedTask ? (
          <form onSubmit={handleGenerate} className="mt-4 space-y-4">
            <p className="text-xs text-slate-300">
              Type any project sentence in plain language. TaskFlow will analyze it and automatically build subtasks, category, priority, and date estimates directly in your browser.
            </p>

            <textarea
              rows="3"
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Finish React application for presentation by Friday high priority with navbar, dashboard, unit testing, and deployment."
              className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-500 rounded-2xl p-4 border border-slate-800 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Generate Task Breakdown
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">AI Draft Generated</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                  {generatedTask.category} • {generatedTask.priority} Priority
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">{generatedTask.title}</h4>
              <p className="text-slate-400 mb-3">{generatedTask.description}</p>

              {/* Subtasks Preview */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300 text-[11px] block">Generated Subtasks ({generatedTask.checklist?.length}):</span>
                {generatedTask.checklist?.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{sub.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setGeneratedTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Re-Prompt
              </button>
              <button
                type="button"
                onClick={handleConfirmTask}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Confirm & Add Task
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
