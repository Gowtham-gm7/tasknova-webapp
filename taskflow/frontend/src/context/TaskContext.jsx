import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStoredTasks, saveStoredTasks } from '../utils/storage';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, updateProfile } = useContext(AuthContext);
  const [allTasks, setAllTasks] = useState(() => getStoredTasks());
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    saveStoredTasks(allTasks);
  }, [allTasks]);

  // Apply Search, Filters, and Sorting
  useEffect(() => {
    let filtered = [...allTasks];

    if (filterCategory !== 'All') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    if (filterPriority !== 'All') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    if (filterStatus !== 'All') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'due') return new Date(a.dueDate || '2099-01-01') - new Date(b.dueDate || '2099-01-01');
      if (sortBy === 'priority') {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 2) - (pMap[a.priority] || 2);
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    setTasks(filtered);
  }, [allTasks, filterCategory, filterPriority, filterStatus, searchQuery, sortBy]);

  const addTask = async (taskData) => {
    const newTask = {
      _id: `task_${Date.now()}`,
      status: 'Todo',
      checklist: [],
      tags: [],
      ...taskData,
      createdAt: new Date().toISOString()
    };
    setAllTasks(prev => [newTask, ...prev]);
    showToast('Task created! 🎉');
    return newTask;
  };

  const updateTask = async (id, updateData) => {
    setAllTasks(prev => prev.map(t => {
      if (t._id === id) {
        const updated = { ...t, ...updateData };
        if (updateData.status === 'Completed' && t.status !== 'Completed') {
          updated.completedAt = new Date().toISOString();
          // Evaluate gamification achievements
          const completedCount = prev.filter(item => item.status === 'Completed').length + 1;
          if (completedCount === 10) {
            showToast('🏅 Achievement Unlocked: 10 Tasks Completed!');
          }
        }
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = async (id) => {
    setAllTasks(prev => prev.filter(t => t._id !== id));
    showToast('Task deleted');
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    setAllTasks(prev => prev.map(t => {
      if (t._id === taskId) {
        const updatedChecklist = (t.checklist || []).map(s => {
          if (s._id === subtaskId) {
            return { ...s, completed: !s.completed };
          }
          return s;
        });
        return { ...t, checklist: updatedChecklist };
      }
      return t;
    }));
  };

  const duplicateTask = async (taskId) => {
    const target = allTasks.find(t => t._id === taskId);
    if (!target) return;

    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      _id: `task_${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'Todo',
      createdAt: new Date().toISOString()
    };

    setAllTasks(prev => [copy, ...prev]);
    showToast('Task duplicated!');
  };

  return (
    <TaskContext.Provider value={{
      tasks: allTasks,
      filteredTasks: tasks,
      filterCategory,
      setFilterCategory,
      filterPriority,
      setFilterPriority,
      filterStatus,
      setFilterStatus,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      toastMessage,
      showToast,
      addTask,
      updateTask,
      deleteTask,
      toggleSubtask,
      duplicateTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};
