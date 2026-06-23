import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, MessageSquare, BookOpen, ChevronDown } from 'lucide-react';
import { savedService } from '../services/api';
import { useSaved } from '../hooks/useSaved';
import type { InterviewQuestion, QuizQuestion } from '../types';

type FilterType = 'all' | 'interview' | 'quiz';

function InterviewCard({ q, onRemove }: { q: InterviewQuestion; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card border border-card-border rounded-2xl overflow-hidden"
      data-testid={`saved-interview-${q.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={10} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{q.category} · {q.difficulty}</span>
          </div>
          <button
            data-testid={`remove-saved-${q.id}`}
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <p className="text-sm font-medium text-foreground leading-relaxed mb-3">{q.question}</p>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:opacity-80 transition-opacity"
          data-testid={`expand-saved-interview-${q.id}`}
        >
          {expanded ? 'Hide answer' : 'View answer'}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={12} />
          </motion.div>
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-border px-5 pt-4 pb-5 space-y-2">
              {(['situation', 'task', 'action', 'result', 'reflection'] as const).map(key => (
                <div key={key} className="text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wide">{key}: </span>
                  <span className="text-foreground">{q.answer[key]}</span>
                </div>
              ))}
              {q.whyItWorks && (
                <div className="mt-3 p-3 bg-primary/5 border border-primary/15 rounded-xl">
                  <p className="text-xs font-semibold text-primary mb-1">Why it works</p>
                  <p className="text-xs text-foreground leading-relaxed">{q.whyItWorks}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuizCard({ q, onRemove }: { q: QuizQuestion; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const diffColors: Record<string, string> = {
    Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card border border-card-border rounded-2xl overflow-hidden"
      data-testid={`saved-quiz-${q.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen size={10} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{q.category} · {q.topic}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffColors[q.difficulty]}`}>
              {q.difficulty}
            </span>
          </div>
          <button
            data-testid={`remove-saved-${q.id}`}
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <p className="text-sm font-medium text-foreground leading-relaxed mb-3">{q.question}</p>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:opacity-80 transition-opacity"
          data-testid={`expand-saved-quiz-${q.id}`}
        >
          {expanded ? 'Hide answer' : 'View answer'}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={12} />
          </motion.div>
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-border px-5 pt-4 pb-5 space-y-3">
              <div className="p-3 bg-muted rounded-xl">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Answer</p>
                <p className="text-xs text-foreground leading-relaxed">{q.answer}</p>
              </div>
              <div className="p-3 bg-primary/5 border border-primary/15 rounded-xl">
                <p className="text-xs font-semibold text-primary mb-1">Why it matters</p>
                <p className="text-xs text-foreground leading-relaxed">{q.whyItMatters}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Saved() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { unsave, count } = useSaved();

  const allSaved = useMemo(() => savedService.getAllSaved() as Array<
    { type: 'interview'; data: InterviewQuestion } | { type: 'quiz'; data: QuizQuestion }
  >, [count]);

  const filtered = useMemo(() => {
    if (filter === 'all') return allSaved;
    return allSaved.filter(item => item.type === filter);
  }, [allSaved, filter]);

  const interviewCount = allSaved.filter(i => i.type === 'interview').length;
  const quizCount = allSaved.filter(i => i.type === 'quiz').length;

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: 'All', count },
    { value: 'interview', label: 'Practice', count: interviewCount },
    { value: 'quiz', label: 'Quiz', count: quizCount },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Saved Questions</h1>
        <p className="text-sm text-muted-foreground">Your personal review list.</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.value}
            data-testid={`filter-${f.value}`}
            onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className={`text-xs min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ${
                filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {count === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
          data-testid="saved-empty"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark size={22} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">Nothing saved yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Save questions during practice or quiz sessions to review them here.
          </p>
        </motion.div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No {filter} questions saved yet.
        </div>
      ) : (
        <motion.div className="space-y-3" layout>
          <AnimatePresence>
            {filtered.map(item =>
              item.type === 'interview' ? (
                <InterviewCard
                  key={item.data.id}
                  q={item.data}
                  onRemove={() => unsave(item.data.id)}
                />
              ) : (
                <QuizCard
                  key={item.data.id}
                  q={item.data}
                  onRemove={() => unsave(item.data.id)}
                />
              )
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
