/**
 * LocalStorage Manager for Pure Client-Side TaskFlow Application
 */

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  USER: 'taskflow_user',
  THEME: 'taskflow_theme',
  WORKSPACES: 'taskflow_workspaces'
};

const DEFAULT_USER = {
  id: 'usr_demo_1',
  name: 'Alex Rivera',
  email: 'alex@taskflow.io',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  productivityScore: 88,
  streak: 7,
  dailyGoal: 5,
  badges: [
    { id: 'first_task', name: 'First Task', icon: '🏅', unlockedAt: new Date().toISOString() },
    { id: 'streak_7', name: '7 Day Streak', icon: '🔥', unlockedAt: new Date().toISOString() },
    { id: 'tasks_10', name: '10 Tasks Completed', icon: '⚡', unlockedAt: new Date().toISOString() }
  ]
};

const DEFAULT_TASKS = [
  {
    _id: 'task_1',
    title: 'Design UI Component System for TaskFlow',
    description: 'Build responsive glassmorphic design tokens, button states, and theme colors in Tailwind.',
    category: 'Work',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '17:00',
    estimatedTime: 180,
    tags: ['UI', 'Tailwind', 'Design'],
    checklist: [
      { _id: 'sub_1', title: 'Define CSS Variables & Dark Mode palette', completed: true },
      { _id: 'sub_2', title: 'Create reusable Modal and Dropdown', completed: true },
      { _id: 'sub_3', title: 'Implement Framer Motion micro-animations', completed: false }
    ],
    notes: 'Check Figma design board for brand color hex codes.',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: 'task_2',
    title: 'Integrate Client-Side AI Task Generator',
    description: 'Allow users to type natural language sentences and parse them into structured subtasks.',
    category: 'Work',
    priority: 'High',
    status: 'Todo',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dueTime: '12:00',
    estimatedTime: 120,
    tags: ['AI', 'React', 'Parser'],
    checklist: [
      { _id: 'sub_4', title: 'Write heuristic prompt parser', completed: true },
      { _id: 'sub_5', title: 'Create client AI draft preview modal', completed: true },
      { _id: 'sub_6', title: 'Test edge case sentence structures', completed: false }
    ],
    notes: 'Runs 100% locally in browser memory!',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'task_3',
    title: 'Complete 4 Pomodoro Focus Sessions',
    description: 'Deep work focus block for core architecture optimization.',
    category: 'Personal',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '20:00',
    estimatedTime: 100,
    tags: ['Productivity', 'Focus'],
    checklist: [
      { _id: 'sub_7', title: 'Session 1: UI Polish', completed: true },
      { _id: 'sub_8', title: 'Session 2: LocalStorage Engine', completed: true }
    ],
    notes: 'Very productive focus block!',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    _id: 'task_4',
    title: 'Weekly Grocery & Meal Prep Shopping',
    description: 'Buy fresh produce, high protein snacks, and electrolyte drinks.',
    category: 'Shopping',
    priority: 'Low',
    status: 'Todo',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    dueTime: '10:00',
    estimatedTime: 45,
    tags: ['Health', 'Life'],
    checklist: [
      { _id: 'sub_9', title: 'Avocados & Spinach', completed: false },
      { _id: 'sub_10', title: 'Chicken Breast & Almonds', completed: false }
    ],
    notes: '',
    createdAt: new Date().toISOString()
  }
];

export const getStoredTasks = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_TASKS;
  }
};

export const saveStoredTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getStoredUser = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_USER;
  }
};

export const saveStoredUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};
