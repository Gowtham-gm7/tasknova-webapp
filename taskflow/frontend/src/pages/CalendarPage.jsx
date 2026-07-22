import React from 'react';
import { TaskCalendar } from '../components/calendar/TaskCalendar';

export const CalendarPage = ({ onEditTask }) => {
  return (
    <div>
      <TaskCalendar onSelectTask={onEditTask} />
    </div>
  );
};
