/**
 * Client-Side AI Task Generator Engine
 * Parses natural language input sentences into structured task JSON
 * directly inside the browser.
 */

export const parseNaturalLanguageTask = (prompt) => {
  const lower = prompt.toLowerCase();
  
  // Clean Title
  let title = prompt.trim();
  if (title.length > 65) {
    title = title.substring(0, 62) + '...';
  }
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Determine Priority
  let priority = 'Medium';
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('high') || lower.includes('critical') || lower.includes('important')) {
    priority = 'High';
  } else if (lower.includes('low') || lower.includes('whenever') || lower.includes('someday') || lower.includes('minor')) {
    priority = 'Low';
  }

  // Determine Category
  let category = 'Work';
  if (lower.includes('study') || lower.includes('exam') || lower.includes('read') || lower.includes('course')) {
    category = 'Study';
  } else if (lower.includes('college') || lower.includes('assignment') || lower.includes('homework')) {
    category = 'College';
  } else if (lower.includes('buy') || lower.includes('shop') || lower.includes('grocery') || lower.includes('store')) {
    category = 'Shopping';
  } else if (lower.includes('workout') || lower.includes('health') || lower.includes('gym') || lower.includes('doctor')) {
    category = 'Health';
  } else if (lower.includes('pay') || lower.includes('bill') || lower.includes('bank') || lower.includes('budget') || lower.includes('finance')) {
    category = 'Finance';
  } else if (lower.includes('clean') || lower.includes('home') || lower.includes('family') || lower.includes('movie') || lower.includes('vacation')) {
    category = 'Personal';
  }

  // Estimated Time
  let estimatedTime = 60;
  if (lower.includes('quick') || lower.includes('small')) estimatedTime = 25;
  if (lower.includes('project') || lower.includes('launch') || lower.includes('build')) estimatedTime = 180;

  // Due Date Parsing
  const now = new Date();
  let dueDateObj = new Date(now.getTime() + 86400000 * 2);
  
  if (lower.includes('today')) {
    dueDateObj = now;
  } else if (lower.includes('tomorrow')) {
    dueDateObj = new Date(now.getTime() + 86400000);
  } else if (lower.includes('friday')) {
    const day = now.getDay();
    const diff = (5 - day + 7) % 7 || 7;
    dueDateObj = new Date(now.getTime() + diff * 86400000);
  } else if (lower.includes('next week')) {
    dueDateObj = new Date(now.getTime() + 7 * 86400000);
  }

  const dueDate = dueDateObj.toISOString().split('T')[0];

  // Smart Subtasks breakdown based on keywords
  let checklist = [];
  if (lower.includes('react') || lower.includes('website') || lower.includes('app') || lower.includes('code') || lower.includes('project')) {
    checklist = [
      { _id: `sub_${Date.now()}_1`, title: 'Setup project workspace and dependencies', completed: false },
      { _id: `sub_${Date.now()}_2`, title: 'Build UI Layout & Responsive Components', completed: false },
      { _id: `sub_${Date.now()}_3`, title: 'Implement State Management & Data Handlers', completed: false },
      { _id: `sub_${Date.now()}_4`, title: 'Perform QA Testing & Edge Case Validation', completed: false },
      { _id: `sub_${Date.now()}_5`, title: 'Deploy to Netlify Production Server', completed: false }
    ];
  } else if (lower.includes('exam') || lower.includes('study') || lower.includes('course') || lower.includes('read')) {
    checklist = [
      { _id: `sub_${Date.now()}_1`, title: 'Review lecture notes & core syllabus key points', completed: false },
      { _id: `sub_${Date.now()}_2`, title: 'Create summary flashcards for difficult concepts', completed: false },
      { _id: `sub_${Date.now()}_3`, title: 'Solve 3 practice quizzes or mock exercises', completed: false },
      { _id: `sub_${Date.now()}_4`, title: 'Final revision session before test date', completed: false }
    ];
  } else if (lower.includes('presentation') || lower.includes('meeting') || lower.includes('report')) {
    checklist = [
      { _id: `sub_${Date.now()}_1`, title: 'Gather requirements & data metrics', completed: false },
      { _id: `sub_${Date.now()}_2`, title: 'Draft slide deck outline & visuals', completed: false },
      { _id: `sub_${Date.now()}_3`, title: 'Rehearse delivery & timing', completed: false },
      { _id: `sub_${Date.now()}_4`, title: 'Share preview with team for feedback', completed: false }
    ];
  } else {
    checklist = [
      { _id: `sub_${Date.now()}_1`, title: 'Define core goals & requirements', completed: false },
      { _id: `sub_${Date.now()}_2`, title: 'Execute primary milestone phase 1', completed: false },
      { _id: `sub_${Date.now()}_3`, title: 'Review output & refine details', completed: false },
      { _id: `sub_${Date.now()}_4`, title: 'Mark finalized and document results', completed: false }
    ];
  }

  const tags = [category.toLowerCase(), priority.toLowerCase(), 'ai-generated'];

  return {
    title,
    description: `AI Structured Plan generated for: "${prompt}"`,
    category,
    priority,
    status: 'Todo',
    dueDate,
    dueTime: '17:00',
    estimatedTime,
    tags,
    checklist,
    notes: 'Generated automatically by TaskFlow AI Assistant.'
  };
};
