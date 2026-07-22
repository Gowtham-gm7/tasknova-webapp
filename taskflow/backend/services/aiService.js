const https = require('https');

/**
 * Intelligent AI Task Decomposition Service
 * Uses Google Gemini API if GEMINI_API_KEY is configured,
 * otherwise runs an advanced heuristic NLP engine.
 */
class AIService {
  static async generateTaskFromPrompt(prompt, userContext = {}) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 5) {
      try {
        return await this.callGeminiAPI(prompt, apiKey);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local heuristic NLP engine:', err.message);
      }
    }

    return this.generateHeuristicTask(prompt);
  }

  static generateHeuristicTask(prompt) {
    const lower = prompt.toLowerCase();
    
    // Title clean up
    let title = prompt.trim();
    if (title.length > 60) {
      title = title.substring(0, 57) + '...';
    }
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Determine Priority
    let priority = 'Medium';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('high') || lower.includes('critical') || lower.includes('important')) {
      priority = 'High';
    } else if (lower.includes('low') || lower.includes('whenever') || lower.includes('minor') || lower.includes('someday')) {
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

    // Estimate Time
    let estimatedTime = 60;
    if (lower.includes('quick') || lower.includes('small')) estimatedTime = 25;
    if (lower.includes('project') || lower.includes('launch') || lower.includes('build')) estimatedTime = 180;

    // Due Date Parsing
    const now = new Date();
    let dueDateObj = new Date(now.getTime() + 86400000 * 2); // default +2 days
    
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

    // Generate smart subtasks based on keywords
    let checklist = [];
    if (lower.includes('react') || lower.includes('website') || lower.includes('app') || lower.includes('code') || lower.includes('project')) {
      checklist = [
        { title: 'Setup project workspace and dependencies', completed: false },
        { title: 'Build UI Layout & Responsive Component Architecture', completed: false },
        { title: 'Implement State Management & API Integration', completed: false },
        { title: 'Perform QA Testing & Edge Case Validation', completed: false },
        { title: 'Deploy to Production Server & Monitor', completed: false }
      ];
    } else if (lower.includes('exam') || lower.includes('study') || lower.includes('course') || lower.includes('read')) {
      checklist = [
        { title: 'Review lecture notes & core syllabus key points', completed: false },
        { title: 'Create summary flashcards for difficult concepts', completed: false },
        { title: 'Solve 3 practice quizzes or mock exercises', completed: false },
        { title: 'Final revision session before test date', completed: false }
      ];
    } else if (lower.includes('presentation') || lower.includes('meeting') || lower.includes('report')) {
      checklist = [
        { title: 'Gather requirements & data metrics', completed: false },
        { title: 'Draft slide deck outline & visuals', completed: false },
        { title: 'Rehearse delivery & timing', completed: false },
        { title: 'Share preview with team for feedback', completed: false }
      ];
    } else {
      checklist = [
        { title: 'Define core goals & requirements', completed: false },
        { title: 'Execute primary milestone phase 1', completed: false },
        { title: 'Review output & refine details', completed: false },
        { title: 'Mark finalized and document results', completed: false }
      ];
    }

    const tags = [category.toLowerCase(), priority.toLowerCase(), 'ai-generated'];

    return {
      title,
      description: `AI Structured Plan generated for: "${prompt}"`,
      category,
      priority,
      dueDate,
      dueTime: '17:00',
      estimatedTime,
      tags,
      checklist,
      notes: 'Generated automatically by TaskFlow AI Assistant.'
    };
  }

  static callGeminiAPI(prompt, apiKey) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert project planner assistant. Break down the user prompt into a structured task JSON object with exact fields:
{
  "title": "Clear Actionable Task Title",
  "description": "Comprehensive task summary",
  "category": "One of: Work, Personal, College, Study, Health, Shopping, Finance",
  "priority": "One of: Low, Medium, High",
  "dueDate": "YYYY-MM-DD (estimate reasonably)",
  "dueTime": "HH:MM",
  "estimatedTime": 60,
  "tags": ["tag1", "tag2"],
  "checklist": [{"title": "Subtask 1", "completed": false}, {"title": "Subtask 2", "completed": false}]
}

Return ONLY valid JSON. Do not include markdown code block formatting or extra text.

User Prompt: "${prompt}"`
          }]
        }]
      });

      const req = https.request(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const rawText = parsed.candidates[0].content.parts[0].text;
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const taskObj = JSON.parse(cleaned);
            resolve(taskObj);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

module.exports = AIService;
