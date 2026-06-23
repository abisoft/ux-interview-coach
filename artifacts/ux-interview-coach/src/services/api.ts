import { InterviewQuestion, InterviewCategory, InterviewDifficulty, QuizQuestion, QuizCategory, QuizDifficulty } from '../types';
import { mockInterviewQuestions, mockQuizQuestions } from '../data/mockData';

export const interviewService = {
  getQuestions: (category?: InterviewCategory, difficulty?: InterviewDifficulty): InterviewQuestion[] => {
    let filtered = mockInterviewQuestions;
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    if (difficulty) {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    return filtered;
  },
  
  getQuestionById: (id: string): InterviewQuestion | undefined => {
    return mockInterviewQuestions.find(q => q.id === id);
  }
};

export const quizService = {
  getQuestions: (category?: QuizCategory, difficulty?: QuizDifficulty): QuizQuestion[] => {
    let filtered = mockQuizQuestions;
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    if (difficulty) {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    return filtered;
  },
  
  getQuestionById: (id: string): QuizQuestion | undefined => {
    return mockQuizQuestions.find(q => q.id === id);
  }
};

const SAVED_KEY = 'ux-coach-saved';

type SavedRecord = { id: string; type: 'interview' | 'quiz' };

export const savedService = {
  _getRaw(): SavedRecord[] {
    try {
      const data = localStorage.getItem(SAVED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  
  _saveRaw(records: SavedRecord[]) {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save', e);
    }
  },

  saveQuestion(id: string, type: 'interview' | 'quiz') {
    const current = this._getRaw();
    if (!current.find(r => r.id === id)) {
      current.push({ id, type });
      this._saveRaw(current);
    }
  },

  unsaveQuestion(id: string) {
    const current = this._getRaw();
    this._saveRaw(current.filter(r => r.id !== id));
  },

  isSaved(id: string): boolean {
    const current = this._getRaw();
    return current.some(r => r.id === id);
  },

  getSavedIds(): Set<string> {
    const current = this._getRaw();
    return new Set(current.map(r => r.id));
  },

  getAllSaved() {
    const current = this._getRaw();
    return current.map(record => {
      if (record.type === 'interview') {
        const q = interviewService.getQuestionById(record.id);
        return q ? { type: 'interview', data: q } : null;
      } else {
        const q = quizService.getQuestionById(record.id);
        return q ? { type: 'quiz', data: q } : null;
      }
    }).filter(Boolean);
  }
};
