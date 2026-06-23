import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Bookmark, BookmarkCheck, ArrowRight, ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { quizService } from '../services/api';
import { useSaved } from '../hooks/useSaved';
import type { QuizCategory, QuizQuestion } from '../types';

const CATEGORIES: QuizCategory[] = [
  'UI Foundations',
  'Accessibility',
  'Design Systems',
  'UX Principles',
  'Research',
  'Product Design',
];

const difficultyColors: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

function QuizCard({
  question,
  index,
  total,
  revealed,
  saved,
  onReveal,
  onSave,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  revealed: boolean;
  saved: boolean;
  onReveal: () => void;
  onSave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
      className="bg-card border border-card-border rounded-2xl overflow-hidden"
      data-testid={`quiz-card-${index}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">{index + 1} / {total}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{question.topic}</span>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>

        <p className="text-sm font-medium text-foreground leading-relaxed mb-4">{question.question}</p>

        <div className="flex items-center gap-2">
          <button
            data-testid={`quiz-reveal-${index}`}
            onClick={onReveal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {revealed ? 'Hide answer' : 'Reveal answer'}
            <motion.div animate={{ rotate: revealed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>
          <button
            data-testid={`quiz-save-${index}`}
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
            <div className="border-t border-border px-5 pt-4 pb-5 space-y-3">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Answer</p>
                <p className="text-sm text-foreground leading-relaxed">{question.answer}</p>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl">
                <p className="text-xs font-semibold text-primary mb-1.5">Why this matters</p>
                <p className="text-xs text-foreground leading-relaxed">{question.whyItMatters}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-1.5" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

type Step = 'category' | 'quiz' | 'done';

export function Quiz() {
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<QuizCategory | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const { toggle, isSaved } = useSaved();

  const handleCategorySelect = (cat: QuizCategory) => {
    setCategory(cat);
    setLoading(true);
    setRevealed(new Set());
    setStep('quiz');
    setTimeout(() => {
      const all = quizService.getQuestions(cat);
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 10));
      setLoading(false);
    }, 500);
  };

  const handleReveal = (index: number) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const reset = () => {
    setStep('category');
    setQuestions([]);
    setRevealed(new Set());
    setCategory(null);
  };

  const answeredCount = revealed.size;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        {step === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-10">
              <h1 className="text-2xl font-semibold text-foreground mb-2">UX Knowledge Quiz</h1>
              <p className="text-muted-foreground text-sm">Test your depth across core UX disciplines. Select a category to begin.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  data-testid={`quiz-category-${cat.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => handleCategorySelect(cat)}
                  className="group text-left p-4 bg-card border border-card-border rounded-2xl hover:border-primary hover:shadow-sm transition-all duration-200"
                >
                  <p className="text-sm font-medium text-foreground">{cat}</p>
                  <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    Start <ArrowRight size={11} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="quiz-back"
              >
                <ArrowLeft size={14} />
                Categories
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                data-testid="quiz-reset"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-foreground">{category}</h2>
                <span className="text-xs text-muted-foreground">
                  {answeredCount} of {questions.length} answered
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <QuizCard
                    key={q.id}
                    question={q}
                    index={i}
                    total={questions.length}
                    revealed={revealed.has(i)}
                    saved={isSaved(q.id)}
                    onReveal={() => handleReveal(i)}
                    onSave={() => toggle(q.id, 'quiz')}
                  />
                ))}
              </div>
            )}

            {!loading && questions.length > 0 && answeredCount === questions.length && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 p-6 bg-card border border-card-border rounded-2xl text-center"
                data-testid="quiz-complete-banner"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy size={22} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">Session complete</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  You reviewed all {questions.length} questions in {category}.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    data-testid="quiz-restart"
                    onClick={() => handleCategorySelect(category!)}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
                  >
                    Restart category
                  </button>
                  <button
                    data-testid="quiz-new-category"
                    onClick={reset}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    New category
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
