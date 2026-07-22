import React, { useState, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

export const TaskCalendar = ({ onSelectTask }) => {
  const { tasks } = useContext(TaskContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ dayNumber: d, dateStr: formatted });
  }

  const selectedDayTasks = tasks.filter(t => t.dueDate === selectedDay);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 text-left">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-400" />
            {monthNames[month]} {year}
          </h3>

          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysArray.map((item, idx) => {
            if (!item) return <div key={idx} className="h-16 rounded-xl bg-slate-900/20" />;

            const dayTasks = tasks.filter(t => t.dueDate === item.dateStr);
            const isSelected = item.dateStr === selectedDay;
            const isToday = item.dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={idx}
                onClick={() => setSelectedDay(item.dateStr)}
                className={`h-16 p-1.5 rounded-2xl cursor-pointer border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-600/20 border-brand-500 shadow-md shadow-brand-500/20'
                    : isToday
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-brand-400' : 'text-slate-300'}`}>
                    {item.dayNumber}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {dayTasks.length > 0 && (
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 2).map(t => (
                      <div key={t._id} className="text-[9px] font-semibold truncate px-1 rounded bg-brand-900/40 text-brand-200">
                        {t.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col">
        <div className="pb-3 border-b border-slate-800 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Agenda</h4>
          <p className="text-sm font-bold text-slate-100 mt-1">{selectedDay}</p>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {selectedDayTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No tasks scheduled for this date.
            </div>
          ) : (
            selectedDayTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => onSelectTask(task)}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 cursor-pointer transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">
                    {task.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.dueTime || '18:00'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-200">{task.title}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
