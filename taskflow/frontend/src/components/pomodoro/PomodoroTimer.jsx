import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

export const PomodoroTimer = () => {
  const [mode, setMode] = useState('focus'); // focus (25m), shortBreak (5m), longBreak (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const modeDurations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        setSessionsCompleted(prev => prev + 1);
      }
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          osc.connect(audioCtx.destination);
          osc.frequency.value = 587.33; // D5 pitch chime
          osc.start();
          osc.stop(audioCtx.currentTime + 0.5);
        } catch (e) {}
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, soundEnabled]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(modeDurations[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((modeDurations[mode] - timeLeft) / modeDurations[mode]) * 100);

  return (
    <div className="glass-panel p-8 rounded-3xl max-w-xl mx-auto text-center border border-slate-800 shadow-2xl relative my-6">
      {/* Sound Toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
      >
        {soundEnabled ? <Volume2 className="w-5 h-5 text-brand-400" /> : <VolumeX className="w-5 h-5" />}
      </button>

      <h2 className="text-xl font-extrabold text-slate-100 flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-brand-400" />
        Pomodoro Focus Suite
      </h2>
      <p className="text-xs text-slate-400 mb-6">Boost your deep work momentum with structured time interval blocks.</p>

      {/* Mode Switches */}
      <div className="inline-flex p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 mb-8 gap-1">
        <button
          onClick={() => switchMode('focus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'focus' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          5m Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'longBreak' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          15m Long Break
        </button>
      </div>

      {/* Timer Circle / Counter */}
      <div className="relative w-64 h-64 mx-auto flex flex-col items-center justify-center rounded-full border-4 border-slate-800/80 bg-slate-950/60 shadow-inner mb-8">
        <span className="text-5xl font-extrabold tracking-tight text-white font-mono">{formatTime(timeLeft)}</span>
        <span className="text-xs font-semibold text-brand-400 mt-2 uppercase tracking-widest">{mode} session</span>
        
        {/* Progress Bar Circle Ring Overlay */}
        <div className="absolute inset-0 rounded-full border-4 border-brand-500/40 pointer-events-none" style={{ clipPath: `inset(0 ${100 - progressPercent}% 0 0)` }} />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition transform hover:scale-105"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? 'Pause Focus' : 'Start Timer'}
        </button>

        <button
          onClick={resetTimer}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Session Stats */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-around text-xs">
        <div>
          <span className="text-slate-500 block">Completed Today</span>
          <span className="text-base font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {sessionsCompleted} Sessions
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Total Focus Time</span>
          <span className="text-base font-bold text-slate-200 block mt-0.5">{sessionsCompleted * 25} Mins</span>
        </div>
      </div>
    </div>
  );
};
