// ─── COMPATIBILITY STUB ───
// Re-exports curriculum data in the old format for the existing Learn.jsx page.
// TODO: Replace Learn.jsx with curriculum-based learning paths in Phase 2.

import { learningPaths } from './curriculumData';

// Convert learning paths to flat module format that old Learn.jsx expects
export const learningModules = learningPaths.flatMap((path) =>
  path.lessons.map((lesson, idx) => ({
    id: lesson.id,
    title: lesson.title,
    summary: lesson.content.slice(0, 150) + '...',
    category: path.title,
    difficulty: path.level,
    readTime: `${Math.ceil(lesson.content.length / 800)} min`,
    icon: path.icon,
    completed: false,
    content: lesson.content,
  }))
);

export const learningCategories = [
  { name: 'All', color: '#3b82f6' },
  ...learningPaths.map((p) => ({ name: p.title, color: p.color })),
];
