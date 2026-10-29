// ─── Progress Context — XP, Level, Streak, Achievements Engine ───

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLevelFromXP, getLevelProgress, checkAchievements } from '../data/achievementData';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'bharat-investai-progress';

const defaultProgress = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  completedPaths: [],
  quizScores: {},
  unlockedAchievements: [],
  simulationsRun: 0,
  aiConversations: 0,
  schemesExplored: [],
  marketViews: 0,
  goalsCreated: 0,
  sipCalculations: 0,
  assessmentComplete: false,
  financialLiteracyScore: null,
  perfectQuizStreak: 0,
};

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);
  const [recentAchievement, setRecentAchievement] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // localStorage may be unavailable
    }
  }, [progress]);

  // Update streak on load
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      setProgress((prev) => ({
        ...prev,
        streak: prev.lastActiveDate === yesterday ? prev.streak + 1 : (prev.lastActiveDate ? 1 : prev.streak),
        lastActiveDate: today,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for new achievements after any progress change
  const checkForAchievements = useCallback((updatedProgress) => {
    const stats = {
      login_count: 1,
      lessons_completed: updatedProgress.completedLessons.length,
      quizzes_completed: Object.keys(updatedProgress.quizScores).length,
      streak: updatedProgress.streak,
      simulations_run: updatedProgress.simulationsRun,
      ai_conversations: updatedProgress.aiConversations,
      schemes_explored: updatedProgress.schemesExplored.length,
      market_views: updatedProgress.marketViews,
      goals_created: updatedProgress.goalsCreated,
      sip_calculations: updatedProgress.sipCalculations,
      assessment_complete: updatedProgress.assessmentComplete,
      perfect_quiz: updatedProgress.perfectQuizStreak > 0,
      perfect_quiz_streak: updatedProgress.perfectQuizStreak,
      completed_paths: updatedProgress.completedPaths,
      paths_completed: updatedProgress.completedPaths.length,
      sdgs_covered: 0, // simplified
    };

    const newAchievements = checkAchievements(stats, updatedProgress.unlockedAchievements);
    if (newAchievements.length > 0) {
      const totalNewXP = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);
      const newIds = newAchievements.map((a) => a.id);
      setRecentAchievement(newAchievements[0]);
      setTimeout(() => setRecentAchievement(null), 4000);
      return {
        unlockedAchievements: [...updatedProgress.unlockedAchievements, ...newIds],
        xp: updatedProgress.xp + totalNewXP,
      };
    }
    return {};
  }, []);

  // Add XP
  const addXP = useCallback((amount) => {
    setProgress((prev) => {
      const updated = { ...prev, xp: prev.xp + amount };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Complete a lesson
  const completeLesson = useCallback((lessonId, pathId, xpReward = 10) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updated = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: prev.xp + xpReward,
      };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Complete a path
  const completePath = useCallback((pathId) => {
    setProgress((prev) => {
      if (prev.completedPaths.includes(pathId)) return prev;
      const updated = {
        ...prev,
        completedPaths: [...prev.completedPaths, pathId],
      };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Record quiz score
  const recordQuizScore = useCallback((pathId, score) => {
    setProgress((prev) => {
      const isPerfect = score.percentage === 100;
      const updated = {
        ...prev,
        quizScores: { ...prev.quizScores, [pathId]: score },
        xp: prev.xp + score.xpEarned,
        perfectQuizStreak: isPerfect ? prev.perfectQuizStreak + 1 : 0,
      };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Increment counters
  const incrementStat = useCallback((stat) => {
    setProgress((prev) => {
      const updated = { ...prev, [stat]: (prev[stat] || 0) + 1 };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Complete assessment
  const completeAssessment = useCallback((score) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        assessmentComplete: true,
        financialLiteracyScore: score,
        xp: prev.xp + 25,
      };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Explore a scheme
  const exploreScheme = useCallback((schemeId) => {
    setProgress((prev) => {
      if (prev.schemesExplored.includes(schemeId)) return prev;
      const updated = {
        ...prev,
        schemesExplored: [...prev.schemesExplored, schemeId],
      };
      const achievementUpdates = checkForAchievements(updated);
      return { ...updated, ...achievementUpdates };
    });
  }, [checkForAchievements]);

  // Derived values
  const level = getLevelFromXP(progress.xp);
  const levelProgress = getLevelProgress(progress.xp);

  const value = {
    ...progress,
    level,
    levelProgress,
    recentAchievement,
    addXP,
    completeLesson,
    completePath,
    recordQuizScore,
    incrementStat,
    completeAssessment,
    exploreScheme,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
