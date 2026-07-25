import { UserProgress, ExperienceLegend } from '../types';

const STORAGE_KEY = 'devops_pro_progress_v1';

const defaultProgress: UserProgress = {
  masteredQuestionIds: [],
  bookmarkedQuestionIds: [],
  flashcardBoxes: {},
  flashcardLastReview: {},
  quizResults: [],
  dailyStreak: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  customNotes: {},
  solvedIncidentIds: [],
  completedInterviewSessionsCount: 0,
  lastDailyBlitzDate: '',
  dailyBlitzHistory: {},
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const data = JSON.parse(raw);
    return { ...defaultProgress, ...data };
  } catch (e) {
    console.error('Error loading progress from storage', e);
    return defaultProgress;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress to storage', e);
  }
}
