export type InterviewCategory = 'Behavioral' | 'UX Process' | 'Product Thinking' | 'UX Research' | 'Portfolio Presentation' | 'Whiteboard Challenge';
export type InterviewDifficulty = 'Junior' | 'Mid' | 'Senior';

export type InterviewQuestion = {
  id: string;
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
  question: string;
  answer: {
    situation: string;
    task: string;
    action: string;
    result: string;
    reflection: string;
  };
  whyItWorks: string;
  followUp?: string;
};

export type QuizCategory = 'UI Foundations' | 'Accessibility' | 'Design Systems' | 'UX Principles' | 'Research' | 'Product Design';
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export type QuizQuestion = {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  answer: string;
  whyItMatters: string;
  topic: string;
};

export type SavedItem = 
  | { type: 'interview', data: InterviewQuestion }
  | { type: 'quiz', data: QuizQuestion };
