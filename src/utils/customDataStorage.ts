import { Question, Quiz } from '../types';
import { QUESTIONS as DEFAULT_QUESTIONS } from '../data/questions';
import { QUIZZES as DEFAULT_QUIZZES } from '../data/quizzes';

const QUESTIONS_STORAGE_KEY = 'devops_pro_custom_questions_v1';
const QUIZZES_STORAGE_KEY = 'devops_pro_custom_quizzes_v1';
const ADMIN_AUTH_KEY = 'devops_pro_is_admin';
const ADMIN_PASSWORD_KEY = 'devops_pro_admin_password_v1';
const DEFAULT_ADMIN_PASS = 'devops2026';

export function getAdminPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASS;
  } catch (e) {
    return DEFAULT_ADMIN_PASS;
  }
}

export function setAdminPassword(newPassword: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
  } catch (e) {
    console.error('Failed to save admin password:', e);
  }
}

export function verifyAdminPassword(input: string): boolean {
  if (!input || input.trim() === '') return false;
  const currentPass = getAdminPassword();
  return input.trim() === currentPass;
}

export function loadQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (!raw) return DEFAULT_QUESTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_QUESTIONS;
  } catch (e) {
    console.error('Failed to load custom questions:', e);
    return DEFAULT_QUESTIONS;
  }
}

export function saveQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save questions:', e);
  }
}

export function loadQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (!raw) return DEFAULT_QUIZZES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all default quizzes are included if missing in storage
      const storedIds = new Set(parsed.map((q: Quiz) => q.id));
      const missingDefaults = DEFAULT_QUIZZES.filter(q => !storedIds.has(q.id));
      if (missingDefaults.length > 0) {
        return [...parsed, ...missingDefaults];
      }
      return parsed;
    }
    return DEFAULT_QUIZZES;
  } catch (e) {
    console.error('Failed to load custom quizzes:', e);
    return DEFAULT_QUIZZES;
  }
}

export function saveQuizzes(quizzes: Quiz[]): void {
  try {
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.error('Failed to save quizzes:', e);
  }
}

export function getAdminState(): boolean {
  try {
    const val = localStorage.getItem(ADMIN_AUTH_KEY);
    return val !== 'false'; // Default to open access (true)
  } catch (e) {
    return true;
  }
}

export function setAdminState(isAdmin: boolean): void {
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, isAdmin ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save admin state:', e);
  }
}

export function resetAllDataToDefault(): void {
  try {
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    localStorage.removeItem(QUIZZES_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset custom data:', e);
  }
}
