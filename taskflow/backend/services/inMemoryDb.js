// Fallback in-memory database engine when live MongoDB connection is unavailable

class InMemoryDB {
  constructor() {
    this.users = [];
    this.tasks = [];
    this.categories = [];
    this.workspaces = [];
    this.activities = [];
    this.notifications = [];
    this.pomodoroSessions = [];
    this.initDefaultData();
  }

  initDefaultData() {
    // Default categories
    const defaultCategories = ['Work', 'Personal', 'Study', 'College', 'Health', 'Finance', 'Shopping'];
    defaultCategories.forEach((cat, idx) => {
      this.categories.push({
        _id: `cat_${idx + 1}`,
        name: cat,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx],
        isSystem: true,
        user: null
      });
    });

    // Default admin and user
    const defaultUser = {
      _id: 'usr_demo_1',
      name: 'Alex Rivera',
      email: 'alex@taskflow.io',
      password: '$2a$10$wE8Fz8L4wW9uQ7x5E1.u.u5k7O0qP3Q0zM1y2x3w4v5u6t7s8r9q', // bcrypt hash for 'password123'
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: true,
      productivityScore: 88,
      streak: 7,
      longestStreak: 14,
      dailyGoal: 5,
      completedToday: 3,
      badges: [
        { id: 'first_task', name: 'First Task', icon: '🏅', unlockedAt: new Date().toISOString() },
        { id: 'streak_7', name: '7 Day Streak', icon: '🔥', unlockedAt: new Date().toISOString() },
        { id: 'tasks_10', name: '10 Tasks Completed', icon: '⚡', unlockedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    };
    this.users.push(defaultUser);

    // Seed initial workspace
    const defaultWorkspace = {
      _id: 'ws_demo_1',
      name: 'Product & Design Team',
      description: 'Core product engineering & UI design workspace',
      owner: 'usr_demo_1',
      members: [{ user: 'usr_demo_1', role: 'admin', joinedAt: new Date().toISOString() }],
      code: 'TASK-8821',
      createdAt: new Date().toISOString()
    };
    this.workspaces.push(defaultWorkspace);

    // Seed initial tasks
    const tasksData = [
      {
        _id: 'task_1',
        user: 'usr_demo_1',
        workspace: 'ws_demo_1',
        title: 'Design UI Component System for TaskFlow',
        description: 'Build responsive glassmorphic design tokens, button states, and theme colors in Tailwind.',
        category: 'Work',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dueTime: '17:00',
        estimatedTime: 180,
        tags: ['UI', 'Tailwind', 'Design'],
        labels: ['Frontend', 'Priority'],
        checklist: [
          { _id: 'sub_1', title: 'Define CSS Variables & Dark Mode palette', completed: true },
          { _id: 'sub_2', title: 'Create reusable Modal and Dropdown', completed: true },
          { _id: 'sub_3', title: 'Implement Framer Motion micro-animations', completed: false }
        ],
        notes: 'Check Notion board for detailed Figma link references.',
        isArchived: false,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        _id: 'task_2',
        user: 'usr_demo_1',
        workspace: 'ws_demo_1',
        title: 'Integrate Gemini AI Assistant for Smart Task Creation',
        description: 'Allow users to type natural language sentences and parse them into structured subtasks.',
        category: 'Work',
        priority: 'High',
        status: 'Todo',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        dueTime: '12:00',
        estimatedTime: 120,
        tags: ['AI', 'Node.js', 'API'],
        labels: ['Backend', 'Feature'],
        checklist: [
          { _id: 'sub_4', title: 'Setup Gemini API Key handler', completed: false },
          { _id: 'sub_5', title: 'Write fallback heuristic parser service', completed: true },
          { _id: 'sub_6', title: 'Add Frontend AI Modal UI', completed: false }
        ],
        notes: 'Fallback engine works when API keys are absent.',
        isArchived: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: 'task_3',
        user: 'usr_demo_1',
        workspace: 'ws_demo_1',
        title: 'Complete 4 Pomodoro Focus Sessions',
        description: 'Deep work focus block for core architecture optimization.',
        category: 'Personal',
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '20:00',
        estimatedTime: 100,
        tags: ['Productivity', 'Focus'],
        labels: ['Health'],
        checklist: [
          { _id: 'sub_7', title: 'Session 1: Backend Setup', completed: true },
          { _id: 'sub_8', title: 'Session 2: Auth Endpoints', completed: true }
        ],
        notes: 'Felt very productive!',
        isArchived: false,
        completedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        _id: 'task_4',
        user: 'usr_demo_1',
        workspace: 'ws_demo_1',
        title: 'Weekly Grocery & Meal Prep Shopping',
        description: 'Buy fresh produce, high protein snacks, and electrolyte drinks.',
        category: 'Shopping',
        priority: 'Low',
        status: 'Todo',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        dueTime: '10:00',
        estimatedTime: 45,
        tags: ['Health', 'Life'],
        labels: ['Personal'],
        checklist: [
          { _id: 'sub_9', title: 'Avocados & Spinach', completed: false },
          { _id: 'sub_10', title: 'Chicken Breast & Almonds', completed: false }
        ],
        notes: '',
        isArchived: false,
        createdAt: new Date().toISOString()
      }
    ];
    this.tasks.push(...tasksData);
  }
}

module.exports = new InMemoryDB();
