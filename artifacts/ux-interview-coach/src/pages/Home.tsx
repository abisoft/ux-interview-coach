import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Bookmark, ArrowRight, Lightbulb } from 'lucide-react';
import { useSaved } from '../hooks/useSaved';

const tips = [
  'Use the STAR method (Situation, Task, Action, Result) to structure behavioral answers concisely.',
  'Start every design critique by asking: what problem does this solve for the user?',
  'When given a whiteboard prompt, spend the first two minutes asking clarifying questions.',
  'Quantify your impact in case studies — percentages and metrics are more memorable than adjectives.',
  'Research shows "I don\'t know, but here\'s how I\'d find out" scores higher than a confident wrong answer.',
  'Reference specific design principles (Heuristics, Gestalt, WCAG) to show your theoretical grounding.',
  'Practice your case studies out loud — fluency reduces filler words under interview pressure.',
];

const todaysTip = tips[new Date().getDay() % tips.length];

export function Home() {
  const { count } = useSaved();

  const features = [
    {
      href: '/interview',
      icon: MessageSquare,
      title: 'Interview Practice',
      description: 'Select a category and difficulty, then work through five interview questions with suggested STAR answers and expert commentary.',
      stat: '16 questions',
      cta: 'Start practicing',
    },
    {
      href: '/quiz',
      icon: BookOpen,
      title: 'UX Knowledge Quiz',
      description: 'Test your knowledge of UI foundations, accessibility, design systems, UX principles, research methods, and product design.',
      stat: '18 questions',
      cta: 'Take a quiz',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
            Prepare with confidence.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Sharpen your interview answers and deepen your UX knowledge — designed for designers who take their craft seriously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {features.map(({ href, icon: Icon, title, description, stat, cta }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
            >
              <Link
                href={href}
                data-testid={`feature-card-${title.toLowerCase().replace(/\s/g, '-')}`}
                className="group block h-full p-6 bg-card border border-card-border rounded-2xl hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{stat}</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                  {cta}
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="md:col-span-2 p-5 bg-card border border-card-border rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tip of the day</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{todaysTip}</p>
          </div>

          <Link
            href="/saved"
            data-testid="saved-stat-card"
            className="group flex flex-col justify-between p-5 bg-card border border-card-border rounded-2xl hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bookmark size={14} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved</span>
            </div>
            <div>
              <p className="text-3xl font-semibold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {count === 1 ? 'question saved' : 'questions saved'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary mt-3 group-hover:gap-2.5 transition-all">
              View saved
              <ArrowRight size={12} />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
