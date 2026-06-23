import { Link, useLocation } from 'wouter';
import { BookOpen, MessageSquare, Bookmark, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaved } from '../hooks/useSaved';
import { useDarkMode } from '../hooks/useDarkMode';

export function Nav() {
  const [location] = useLocation();
  const { count } = useSaved();
  const { dark, toggle } = useDarkMode();

  const links = [
    { href: '/interview', label: 'Practice', icon: MessageSquare },
    { href: '/quiz', label: 'Quiz', icon: BookOpen },
    { href: '/saved', label: 'Saved', icon: Bookmark, badge: count },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
          data-testid="nav-logo"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen size={14} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight">UX Interview Coach</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, badge }) => {
            const isActive = location === href || location.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                data-testid={`nav-${label.toLowerCase()}`}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon size={14} />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center leading-none">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            data-testid="dark-mode-toggle"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="ml-1 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {dark ? (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={15} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={15} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </div>
    </header>
  );
}
