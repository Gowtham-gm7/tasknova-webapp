/**
 * Achievement Badges Evaluation Service
 */

const BADGE_DEFINITIONS = [
  { id: 'first_task', name: 'First Task', icon: '🏅', description: 'Completed your first task on TaskFlow' },
  { id: 'tasks_10', name: '10 Tasks Completed', icon: '⚡', description: 'Reached 10 completed productivity tasks' },
  { id: 'tasks_100', name: '100 Tasks Completed', icon: '🚀', description: 'Mastered 100 completed tasks' },
  { id: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Maintained a 7 day productivity streak' },
  { id: 'productivity_master', name: 'Productivity Master', icon: '👑', description: 'Achieved a productivity score of 90+' }
];

class BadgeService {
  static evaluateBadges(userStats) {
    const { completedCount = 0, streak = 0, productivityScore = 0, existingBadges = [] } = userStats;
    const existingIds = new Set(existingBadges.map(b => b.id));
    const newBadges = [];

    if (completedCount >= 1 && !existingIds.has('first_task')) {
      newBadges.push({ ...BADGE_DEFINITIONS[0], unlockedAt: new Date().toISOString() });
    }

    if (completedCount >= 10 && !existingIds.has('tasks_10')) {
      newBadges.push({ ...BADGE_DEFINITIONS[1], unlockedAt: new Date().toISOString() });
    }

    if (completedCount >= 100 && !existingIds.has('tasks_100')) {
      newBadges.push({ ...BADGE_DEFINITIONS[2], unlockedAt: new Date().toISOString() });
    }

    if (streak >= 7 && !existingIds.has('streak_7')) {
      newBadges.push({ ...BADGE_DEFINITIONS[3], unlockedAt: new Date().toISOString() });
    }

    if (productivityScore >= 90 && !existingIds.has('productivity_master')) {
      newBadges.push({ ...BADGE_DEFINITIONS[4], unlockedAt: new Date().toISOString() });
    }

    return newBadges;
  }

  static getAllBadges() {
    return BADGE_DEFINITIONS;
  }
}

module.exports = BadgeService;
