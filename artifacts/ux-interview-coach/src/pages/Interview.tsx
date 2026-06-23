import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Bookmark, BookmarkCheck, RefreshCw, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { interviewService } from '../services/api';
import { useSaved } from '../hooks/useSaved';
import type { InterviewCategory, InterviewDifficulty, InterviewQuestion } from '../types';

const CATEGORIES: InterviewCategory[] = [
  'Behavioral',
  'UX Process',
  'Product Thinking',
  'UX Research',
  'Portfolio Presentation',
  'Whiteboard Challenge',
];

const DIFFICULTIES: InterviewDifficulty[] = ['Junior', 'Mid', 'Senior'];

const difficultyMeta: Record<InterviewDifficulty, { color: string; years: string; desc: string }> = {
  Junior: {
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    years: '0–2 years',
    desc: 'Core process, learning mindset, foundational design thinking.',
  },
  Mid: {
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    years: '2–5 years',
    desc: 'Ownership, cross-functional collaboration, design complexity.',
  },
  Senior: {
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    years: '5+ years',
    desc: 'Strategy, systems thinking, leadership and mentoring.',
  },
};

function QuestionCard({
  question,
  index,
  total,
  saved,
  onSave,
  onReplace,
}: {
  question: InterviewQuestion;
  index: number;
  total: number;
  saved: boolean;
  onSave: () => void;
  onReplace: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const meta = difficultyMeta[question.difficulty];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-card border border-card-border rounded-2xl overflow-hidden"
      data-testid={`question-card-${index}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground font-medium">
            Question {index + 1} of {total}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${meta.color}`}>
            {question.difficulty}
          </span>
        </div>

        <p className="text-base font-medium text-foreground leading-relaxed mb-5">
          {question.question}
        </p>

        <div className="flex items-center gap-2">
          <button
            data-testid={`reveal-answer-${index}`}
            onClick={() => setRevealed(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {revealed ? 'Hide answer' : 'Reveal answer'}
            <motion.div animate={{ rotate: revealed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>

          <button
            data-testid={`replace-question-${index}`}
            onClick={onReplace}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <RefreshCw size={13} />
            Another
          </button>

          <button
            data-testid={`save-question-${index}`}
            onClick={onSave}
            className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
              saved
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="border-t border-border px-6 pb-6 pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {(['situation', 'task', 'action', 'result', 'reflection'] as const).map((key) => (
                  <div key={key} className="bg-muted rounded-xl p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      {key}
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">
                      {question.answer[key]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl">
                <p className="text-xs font-semibold text-primary mb-1.5">Why this answer works</p>
                <p className="text-xs text-foreground leading-relaxed">{question.whyItWorks}</p>
              </div>

              {question.followUp && (
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Possible follow-up question</p>
                  <p className="text-xs text-foreground italic">{question.followUp}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="bg-card border border-card-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-4/5 mb-5" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

type Step = 'difficulty' | 'category' | 'questions';

export function Interview() {
  const [step, setStep] = useState<Step>('difficulty');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty | null>(null);
  const [category, setCategory] = useState<InterviewCategory | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [pool, setPool] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toggle, isSaved } = useSaved();

  const loadQuestions = (cat: InterviewCategory, diff: InterviewDifficulty) => {
    setLoading(true);
    setTimeout(() => {
      const all = interviewService.getQuestions(cat, diff);
      const allByCategory = all.length > 0 ? all : interviewService.getQuestions(cat);
      const shuffled = [...allByCategory].sort(() => Math.random() - 0.5);
      setPool(shuffled);
      setQuestions(shuffled.slice(0, Math.min(5, shuffled.length)));
      setLoading(false);
    }, 550);
  };

  const handleDifficultySelect = (diff: InterviewDifficulty) => {
    setDifficulty(diff);
    setStep('category');
  };

  const handleCategorySelect = (cat: InterviewCategory) => {
    setCategory(cat);
    setStep('questions');
    loadQuestions(cat, difficulty!);
  };

  const handleReplace = (index: number) => {
    const usedIds = new Set(questions.map(q => q.id));
    const unused = pool.filter(q => !usedIds.has(q.id));
    if (unused.length === 0) return;
    const replacement = unused[Math.floor(Math.random() * unused.length)];
    setQuestions(prev => {
      const next = [...prev];
      next[index] = replacement;
      return next;
    });
  };

  const progress = questions.length > 0 ? (questions.length / 5) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">

        {/* ── Step 1: Difficulty ───────────────────────────────────── */}
        {step === 'difficulty' && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-10">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Interview Practice</h1>
              <p className="text-muted-foreground text-sm">First, tell us where you are in your career.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DIFFICULTIES.map(diff => {
                const { color, years, desc } = difficultyMeta[diff];
                return (
                  <motion.button
                    key={diff}
                    data-testid={`difficulty-${diff.toLowerCase()}`}
                    onClick={() => handleDifficultySelect(diff)}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="group text-left p-5 bg-card border border-card-border rounded-2xl hover:border-primary hover:shadow-sm transition-all duration-200"
                  >
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${color}`}>
                      {diff}
                    </span>
                    <p className="text-sm font-medium text-foreground mb-1">{years}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    <div className="mt-4 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      Select <ArrowRight size={11} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Category ─────────────────────────────────────── */}
        {step === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setStep('difficulty')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              data-testid="back-to-difficulty"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                {difficulty && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyMeta[difficulty].color}`}>
                    {difficulty}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">Pick a topic</h1>
              <p className="text-sm text-muted-foreground">Choose the area you want to practice.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  data-testid={`category-${cat.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => handleCategorySelect(cat)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="group text-left p-4 bg-card border border-card-border rounded-2xl hover:border-primary hover:shadow-sm transition-all duration-200"
                >
                  <p className="text-sm font-medium text-foreground">{cat}</p>
                  <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    Start <ArrowRight size={11} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Questions ────────────────────────────────────── */}
        {step === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => { setStep('category'); setQuestions([]); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="back-to-category"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 size={13} />
                {questions.length} questions
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-foreground">{category}</h2>
                {difficulty && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyMeta[difficulty].color}`}>
                    {difficulty}
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : questions.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No questions found for this combination.</p>
                <button
                  onClick={() => setStep('category')}
                  className="text-sm text-primary hover:underline"
                >
                  Try a different category
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={i}
                    total={questions.length}
                    saved={isSaved(q.id)}
                    onSave={() => toggle(q.id, 'interview')}
                    onReplace={() => handleReplace(i)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
