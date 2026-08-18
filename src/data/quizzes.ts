import { Quiz } from '../types';
import { QUICK_QUIZZES } from './quizzes/quickQuizzes';
import { MEDIUM_QUIZZES } from './quizzes/mediumQuizzes';
import { HARDCORE_QUIZZES } from './quizzes/hardcoreQuizzes';

// Unified collection of all quizzes categorized by length & depth:
// 1. Quick Blitz Quizzes (4-5 questions, 6-8 min)
// 2. Medium In-Depth Quizzes (12 questions, 18-20 min)
// 3. Hardcore Comprehensive Marathons (30 questions, 45-50 min)
export const QUIZZES: Quiz[] = [
  ...QUICK_QUIZZES,
  ...MEDIUM_QUIZZES,
  ...HARDCORE_QUIZZES
];

export { QUICK_QUIZZES, MEDIUM_QUIZZES, HARDCORE_QUIZZES };
