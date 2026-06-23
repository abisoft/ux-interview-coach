import { useState, useCallback, useEffect } from 'react';
import { savedService } from '../services/api';

export function useSaved() {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => savedService.getSavedIds());

  const refresh = useCallback(() => {
    setSavedIds(savedService.getSavedIds());
  }, []);

  const save = useCallback((id: string, type: 'interview' | 'quiz') => {
    savedService.saveQuestion(id, type);
    refresh();
  }, [refresh]);

  const unsave = useCallback((id: string) => {
    savedService.unsaveQuestion(id);
    refresh();
  }, [refresh]);

  const toggle = useCallback((id: string, type: 'interview' | 'quiz') => {
    if (savedIds.has(id)) {
      unsave(id);
    } else {
      save(id, type);
    }
  }, [savedIds, save, unsave]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  return { savedIds, save, unsave, toggle, isSaved, count: savedIds.size };
}
