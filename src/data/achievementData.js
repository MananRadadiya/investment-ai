// ─── Achievement & Level System ───

// ─── Level Definitions ───
export const levels = [
  { level: 1, name: 'Curious Learner', icon: '🌱', minXP: 0, maxXP: 100, color: '#10b981' },
  { level: 2, name: 'Knowledge Seeker', icon: '📖', minXP: 100, maxXP: 250, color: '#3b82f6' },
  { level: 3, name: 'Smart Saver', icon: '💡', minXP: 250, maxXP: 500, color: '#f59e0b' },
  { level: 4, name: 'Informed Investor', icon: '📊', minXP: 500, maxXP: 1000, color: '#8b5cf6' },
  { level: 5, name: 'Strategic Planner', icon: '🎯', minXP: 1000, maxXP: 2000, color: '#ec4899' },
  { level: 6, name: 'Risk-Aware Investor', icon: '🛡️', minXP: 2000, maxXP: 3500, color: '#14b8a6' },
  { level: 7, name: 'Financial Champion', icon: '🏆', minXP: 3500, maxXP: 5000, color: '#eab308' },
  { level: 8, name: 'Viksit Bharat Leader', icon: '⭐', minXP: 5000, maxXP: Infinity, color: '#f97316' },
];

// ─── Achievement Definitions ───
export const achievements = [
  // Onboarding
  { id: 'first-login', name: 'First Step', icon: '👋', description: 'Logged in to Bharat InvestAI for the first time', category: 'milestone', xpReward: 10, condition: 'login_count >= 1' },
  { id: 'assessment-complete', name: 'Self-Aware', icon: '🪞', description: 'Completed the Financial Literacy Assessment', category: 'milestone', xpReward: 25, condition: 'assessment_complete' },

  // Learning
  { id: 'first-lesson', name: 'Knowledge Begins', icon: '📚', description: 'Completed your first lesson', category: 'learning', xpReward: 15, condition: 'lessons_completed >= 1' },
  { id: 'five-lessons', name: 'Quick Learner', icon: '⚡', description: 'Completed 5 lessons', category: 'learning', xpReward: 25, condition: 'lessons_completed >= 5' },
  { id: 'ten-lessons', name: 'Dedicated Student', icon: '🎒', description: 'Completed 10 lessons', category: 'learning', xpReward: 50, condition: 'lessons_completed >= 10' },
  { id: 'all-basics', name: 'Foundations Laid', icon: '🧱', description: 'Completed the Money Basics learning path', category: 'learning', xpReward: 50, condition: 'path_complete_money-basics' },
  { id: 'all-mf', name: 'MF Expert', icon: '📈', description: 'Completed the Mutual Funds & SIP learning path', category: 'learning', xpReward: 50, condition: 'path_complete_mutual-funds' },
  { id: 'all-paths', name: 'Financial Scholar', icon: '🎓', description: 'Completed all 7 learning paths', category: 'learning', xpReward: 200, condition: 'paths_completed >= 7' },

  // Quizzes
  { id: 'first-quiz', name: 'Test Taker', icon: '✏️', description: 'Completed your first quiz', category: 'quiz', xpReward: 10, condition: 'quizzes_completed >= 1' },
  { id: 'perfect-quiz', name: 'Perfect Score', icon: '💯', description: 'Got 100% on any quiz', category: 'quiz', xpReward: 30, condition: 'perfect_quiz' },
  { id: 'quiz-streak-3', name: 'Quiz Champion', icon: '🏅', description: 'Got 3 perfect quiz scores in a row', category: 'quiz', xpReward: 50, condition: 'perfect_quiz_streak >= 3' },

  // Streaks
  { id: 'streak-3', name: 'Getting Started', icon: '🔥', description: 'Maintained a 3-day learning streak', category: 'streak', xpReward: 15, condition: 'streak >= 3' },
  { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: 'Maintained a 7-day learning streak', category: 'streak', xpReward: 30, condition: 'streak >= 7' },
  { id: 'streak-14', name: 'Consistent Learner', icon: '🔥', description: 'Maintained a 14-day learning streak', category: 'streak', xpReward: 50, condition: 'streak >= 14' },
  { id: 'streak-30', name: 'Monthly Master', icon: '🔥', description: 'Maintained a 30-day learning streak', category: 'streak', xpReward: 100, condition: 'streak >= 30' },

  // Simulation
  { id: 'first-sim', name: 'Simulated Investor', icon: '🧪', description: 'Ran your first investment simulation', category: 'simulation', xpReward: 15, condition: 'simulations_run >= 1' },
  { id: 'goal-setter', name: 'Goal Setter', icon: '🎯', description: 'Created your first financial goal', category: 'simulation', xpReward: 15, condition: 'goals_created >= 1' },
  { id: 'sip-master', name: 'SIP Master', icon: '💰', description: 'Used the SIP calculator to plan 3 different goals', category: 'simulation', xpReward: 25, condition: 'sip_calculations >= 3' },

  // AI Interaction
  { id: 'first-chat', name: 'Curious Mind', icon: '💬', description: 'Had your first conversation with the AI Mentor', category: 'ai', xpReward: 10, condition: 'ai_conversations >= 1' },
  { id: 'ten-chats', name: 'Knowledge Explorer', icon: '🔍', description: 'Asked the AI Mentor 10 questions', category: 'ai', xpReward: 25, condition: 'ai_conversations >= 10' },

  // Exploration
  { id: 'scheme-explorer', name: 'Scheme Explorer', icon: '🏛️', description: 'Explored 5 government investment schemes', category: 'exploration', xpReward: 20, condition: 'schemes_explored >= 5' },
  { id: 'market-watcher', name: 'Market Watcher', icon: '📊', description: 'Checked the Indian market dashboard 7 times', category: 'exploration', xpReward: 15, condition: 'market_views >= 7' },

  // SDG
  { id: 'sdg-learner', name: 'SDG Champion', icon: '🌍', description: 'Completed lessons mapped to all 5 SDGs', category: 'sdg', xpReward: 100, condition: 'sdgs_covered >= 5' },
];

// ─── Helper Functions ───

// Get current level from XP
export function getLevelFromXP(xp) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) return levels[i];
  }
  return levels[0];
}

// Get XP progress within current level
export function getLevelProgress(xp) {
  const level = getLevelFromXP(xp);
  if (level.maxXP === Infinity) return { current: xp - level.minXP, max: 1000, percent: 100 };
  const current = xp - level.minXP;
  const max = level.maxXP - level.minXP;
  return { current, max, percent: Math.round((current / max) * 100) };
}

// Get next level
export function getNextLevel(xp) {
  const currentLevel = getLevelFromXP(xp);
  const nextIdx = levels.findIndex((l) => l.level === currentLevel.level) + 1;
  return nextIdx < levels.length ? levels[nextIdx] : null;
}

// Check if an achievement should be unlocked
export function checkAchievements(userStats, unlockedIds) {
  const newlyUnlocked = [];
  achievements.forEach((a) => {
    if (unlockedIds.includes(a.id)) return; // already unlocked
    let shouldUnlock = false;
    // Parse simple conditions
    if (a.condition.includes('>=')) {
      const [key, val] = a.condition.split(' >= ');
      shouldUnlock = (userStats[key.trim()] || 0) >= parseInt(val);
    } else if (a.condition === 'assessment_complete') {
      shouldUnlock = !!userStats.assessment_complete;
    } else if (a.condition === 'perfect_quiz') {
      shouldUnlock = !!userStats.perfect_quiz;
    } else if (a.condition.startsWith('path_complete_')) {
      const pathId = a.condition.replace('path_complete_', '');
      shouldUnlock = (userStats.completed_paths || []).includes(pathId);
    }
    if (shouldUnlock) newlyUnlocked.push(a);
  });
  return newlyUnlocked;
}
