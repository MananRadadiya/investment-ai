import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { learningPaths, getLessonById } from '../data/curriculumData';
import { getQuizByPathId, calculateQuizScore } from '../data/quizBank';
import {
  BookOpen, ChevronRight, ChevronLeft, CheckCircle2,
  Lock, ArrowRight, Trophy, Sparkles, RotateCcw,
  Target, Clock, Award,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

// ─── VIEW: PATH LIST ───
function PathList({ onSelectPath, completedLessons, completedPaths }) {
  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="heading-tight" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
          Learning Paths 🎓
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          7 structured paths from savings basics to portfolio theory — every lesson uses Indian examples
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {learningPaths.map((path, idx) => {
          const completed = path.lessons.filter((l) => completedLessons.includes(l.id)).length;
          const percent = Math.round((completed / path.lessons.length) * 100);
          const isComplete = completedPaths.includes(path.id);
          const isLocked = path.prerequisites.length > 0 && !path.prerequisites.every((p) => completedPaths.includes(p));

          return (
            <motion.div
              key={path.id}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: idx * 0.04 }}
              className={isLocked ? 'panel' : 'panel-interactive'}
              onClick={() => !isLocked && onSelectPath(path)}
              style={{
                padding: 'var(--space-5)',
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                  background: `${path.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>
                  {isLocked ? <Lock style={{ width: 20, height: 20, color: 'var(--text-ghost)' }} /> : path.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <h3 className="heading-tight" style={{ fontSize: 'var(--text-md)' }}>
                      {path.title}
                    </h3>
                    {isComplete && <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--color-growth)' }} />}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                    {path.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BookOpen style={{ width: 12, height: 12 }} /> {path.lessonCount} lessons
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock style={{ width: 12, height: 12 }} /> {path.estimatedTime}
                    </span>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)',
                      background: path.level === 'Beginner' ? 'var(--color-growth-soft)' : path.level === 'Intermediate' ? 'var(--color-learning-soft)' : 'var(--color-ai-soft)',
                      color: path.level === 'Beginner' ? 'var(--color-growth)' : path.level === 'Intermediate' ? 'var(--color-learning)' : 'var(--color-ai)',
                    }}>
                      {path.level}
                    </span>
                    {path.sdg.map((sdg) => (
                      <span key={sdg} className="sdg-badge" style={{ fontSize: '9px', padding: '1px 6px' }}>
                        {sdg}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)', flexShrink: 0 }}>
                  <span className="mono-number" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {completed}/{path.lessons.length}
                  </span>
                  <div style={{ width: 80 }} className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${percent}%`, background: path.color }} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VIEW: PATH DETAIL (lesson list) ───
function PathDetail({ path, onBack, onSelectLesson, completedLessons }) {
  const completed = path.lessons.filter((l) => completedLessons.includes(l.id)).length;
  const percent = Math.round((completed / path.lessons.length) * 100);

  return (
    <div>
      {/* Back + Header */}
      <button onClick={onBack} className="btn-ghost" style={{ marginBottom: 'var(--space-4)', height: 32, fontSize: '12px', padding: '0 10px' }}>
        <ChevronLeft style={{ width: 14, height: 14 }} /> All Paths
      </button>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-2xl)' }}>{path.icon}</span>
          <h1 className="heading-tight" style={{ fontSize: 'var(--text-2xl)' }}>{path.title}</h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
          {path.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="progress-bar" style={{ flex: 1, maxWidth: 300 }}>
            <div className="progress-bar-fill" style={{ width: `${percent}%`, background: path.color }} />
          </div>
          <span className="mono-number" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {completed}/{path.lessons.length} lessons · {percent}%
          </span>
        </div>
      </div>

      {/* Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {path.lessons.map((lesson, idx) => {
          const isComplete = completedLessons.includes(lesson.id);
          return (
            <motion.div
              key={lesson.id}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: idx * 0.03 }}
              className="panel-interactive"
              onClick={() => onSelectLesson(lesson)}
              style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-full)',
                background: isComplete ? 'var(--color-growth-soft)' : 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '13px', fontWeight: 700,
                color: isComplete ? 'var(--color-growth)' : 'var(--text-tertiary)',
              }}>
                {isComplete ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 2 }}>
                  {lesson.title}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  +{lesson.xpReward} XP
                </p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: 'var(--text-ghost)', flexShrink: 0 }} />
            </motion.div>
          );
        })}
      </div>

      {/* Quiz Button */}
      {completed === path.lessons.length && (
        <motion.div {...fadeIn} style={{ marginTop: 'var(--space-6)' }}>
          <button
            onClick={() => onSelectLesson({ id: `quiz-${path.id}`, isQuiz: true })}
            className="btn-primary"
            style={{ width: '100%', height: 48, fontSize: '15px' }}
          >
            <Award style={{ width: 18, height: 18 }} />
            Take the Quiz — Test Your Knowledge
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── VIEW: LESSON READER ───
function LessonReader({ lesson, pathId, onBack, onComplete, isCompleted }) {
  return (
    <div>
      <button onClick={onBack} className="btn-ghost" style={{ marginBottom: 'var(--space-4)', height: 32, fontSize: '12px', padding: '0 10px' }}>
        <ChevronLeft style={{ width: 14, height: 14 }} /> Back to Path
      </button>

      <motion.div {...fadeIn} className="panel" style={{ padding: 'var(--space-8)', maxWidth: 720 }}>
        <h1 className="heading-tight" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>
          {lesson.title}
        </h1>

        {/* Lesson Content */}
        <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
          {lesson.content.split('\n\n').map((paragraph, i) => (
            <p key={i} style={{ marginBottom: 'var(--space-4)' }}>
              {paragraph.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  {j < paragraph.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Key Takeaway */}
        <div style={{
          padding: 'var(--space-5)', borderRadius: 'var(--radius-sm)',
          background: 'var(--color-learning-soft)', border: '1px solid rgba(245, 158, 11, 0.15)',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <Sparkles style={{ width: 15, height: 15, color: 'var(--color-learning)' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-learning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Key Takeaway
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.7 }}>
            {lesson.keyTakeaway}
          </p>
        </div>

        {/* Complete Button */}
        {isCompleted ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)',
            background: 'var(--color-growth-soft)',
          }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: 'var(--color-growth)' }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-growth)' }}>
              Lesson Completed ✓
            </span>
          </div>
        ) : (
          <button
            onClick={() => onComplete(lesson.id, pathId, lesson.xpReward)}
            className="btn-primary"
            style={{ width: '100%', height: 48, fontSize: '15px' }}
          >
            <CheckCircle2 style={{ width: 18, height: 18 }} />
            Complete Lesson (+{lesson.xpReward} XP)
          </button>
        )}
      </motion.div>
    </div>
  );
}

// ─── VIEW: QUIZ ───
function QuizView({ pathId, path, onBack, onComplete }) {
  const questions = getQuizByPathId(pathId);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  if (questions.length === 0) {
    return (
      <div>
        <button onClick={onBack} className="btn-ghost" style={{ marginBottom: 'var(--space-4)', height: 32, fontSize: '12px', padding: '0 10px' }}>
          <ChevronLeft style={{ width: 14, height: 14 }} /> Back
        </button>
        <div className="panel" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
            Quiz coming soon for this path! 🚧
          </p>
        </div>
      </div>
    );
  }

  const handleAnswer = (optionIdx) => {
    setSelectedOption(optionIdx);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ + 1 >= questions.length) {
      // Quiz complete
      const result = calculateQuizScore(pathId, newAnswers);
      setQuizResult(result);
      setShowResult(true);
      onComplete(pathId, result);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  if (showResult && quizResult) {
    return (
      <div>
        <button onClick={onBack} className="btn-ghost" style={{ marginBottom: 'var(--space-4)', height: 32, fontSize: '12px', padding: '0 10px' }}>
          <ChevronLeft style={{ width: 14, height: 14 }} /> Back to Path
        </button>

        <motion.div {...fadeIn} className="panel" style={{ padding: 'var(--space-8)', maxWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>
              {quizResult.percentage >= 80 ? '🎉' : quizResult.percentage >= 60 ? '👍' : '📖'}
            </div>
            <h2 className="heading-tight" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
              {quizResult.percentage >= 80 ? 'Excellent!' : quizResult.percentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            <p className="mono-number" style={{ fontSize: 'var(--text-2xl)', color: quizResult.percentage >= 80 ? 'var(--color-growth)' : 'var(--color-learning)' }}>
              {quizResult.correct}/{quizResult.total} correct ({quizResult.percentage}%)
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              +{quizResult.xpEarned} XP earned
            </p>
          </div>

          {/* Answer Review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {quizResult.results.map((r, i) => (
              <div key={i} style={{
                padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)',
                background: r.isCorrect ? 'var(--color-growth-soft)' : 'var(--color-danger-soft)',
                border: `1px solid ${r.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
              }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
                  {r.isCorrect ? '✓' : '✗'} {r.question}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {r.explanation}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={onBack}
            className="btn-primary"
            style={{ width: '100%', height: 44, marginTop: 'var(--space-6)' }}
          >
            Back to Path
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div>
      <button onClick={onBack} className="btn-ghost" style={{ marginBottom: 'var(--space-4)', height: 32, fontSize: '12px', padding: '0 10px' }}>
        <ChevronLeft style={{ width: 14, height: 14 }} /> Back
      </button>

      <motion.div {...fadeIn} className="panel" style={{ padding: 'var(--space-8)', maxWidth: 600 }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <span className="mono-number" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Question {currentQ + 1} of {questions.length}
          </span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{
              width: `${((currentQ + 1) / questions.length) * 100}%`,
              background: path.color,
            }} />
          </div>
        </div>

        {/* Question */}
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
          {q.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)',
                background: selectedOption === i ? `${path.color}15` : 'var(--surface-1)',
                border: selectedOption === i ? `2px solid ${path.color}` : '2px solid transparent',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 'var(--text-sm)', color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 150ms',
                width: '100%',
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: 'var(--radius-full)',
                background: selectedOption === i ? path.color : 'var(--surface-3)',
                color: selectedOption === i ? '#fff' : 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 600, flexShrink: 0,
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="btn-primary"
          style={{
            width: '100%', height: 44,
            opacity: selectedOption !== null ? 1 : 0.4,
          }}
        >
          {currentQ + 1 >= questions.length ? 'Submit Quiz' : 'Next Question'}
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </motion.div>
    </div>
  );
}

// ═══════ MAIN COMPONENT ═══════
export default function Learn() {
  const {
    completedLessons, completedPaths,
    completeLesson, completePath, recordQuizScore,
  } = useProgress();

  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Handle path selection
  const handleSelectPath = (path) => {
    setSelectedPath(path);
    setSelectedLesson(null);
    setShowQuiz(false);
  };

  // Handle lesson selection
  const handleSelectLesson = (lesson) => {
    if (lesson.isQuiz) {
      setShowQuiz(true);
      setSelectedLesson(null);
    } else {
      setSelectedLesson(lesson);
      setShowQuiz(false);
    }
  };

  // Handle lesson completion
  const handleCompleteLesson = (lessonId, pathId, xpReward) => {
    completeLesson(lessonId, pathId, xpReward);

    // Check if all lessons in path are now complete
    if (selectedPath) {
      const allComplete = selectedPath.lessons.every(
        (l) => l.id === lessonId || completedLessons.includes(l.id)
      );
      if (allComplete) {
        completePath(pathId);
      }
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (pathId, result) => {
    recordQuizScore(pathId, result);
  };

  // ── RENDER ──
  // Quiz view
  if (showQuiz && selectedPath) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <QuizView
          pathId={selectedPath.id}
          path={selectedPath}
          onBack={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      </motion.div>
    );
  }

  // Lesson reader view
  if (selectedLesson && selectedPath) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <LessonReader
          lesson={selectedLesson}
          pathId={selectedPath.id}
          onBack={() => setSelectedLesson(null)}
          onComplete={handleCompleteLesson}
          isCompleted={completedLessons.includes(selectedLesson.id)}
        />
      </motion.div>
    );
  }

  // Path detail view (lesson list)
  if (selectedPath) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PathDetail
          path={selectedPath}
          onBack={() => setSelectedPath(null)}
          onSelectLesson={handleSelectLesson}
          completedLessons={completedLessons}
        />
      </motion.div>
    );
  }

  // Path list view (default)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PathList
        onSelectPath={handleSelectPath}
        completedLessons={completedLessons}
        completedPaths={completedPaths}
      />
    </motion.div>
  );
}
