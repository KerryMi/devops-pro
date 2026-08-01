import { UserProgress, ExperienceLegend } from '../types';

const STORAGE_KEY = 'devops_pro_progress_v1';

export const DEFAULT_PROGRESS: UserProgress = {
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
  seenAchievementIds: [],
  claimedAchievementIds: []
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const data = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...data };
  } catch (e) {
    console.error('Error loading progress from storage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress to storage', e);
  }
}

export function clearUserProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('devops_pro_seen_achievements');
  } catch (e) {
    console.error('Error clearing progress from storage', e);
  }
}
