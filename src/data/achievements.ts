import { UserProgress, Question, Achievement } from '../types';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: 'Learning' | 'Practice' | 'Streak' | 'Career';
  iconName: string;
  color: string;
  bgLight: string;
  goalValue: number;
  unit?: string;
  getValue: (progress: UserProgress, questions: Question[]) => number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first_question',
    title: 'Первый шаг',
    description: 'Изучите свой первый вопрос в базе знаний DevOps Pro.',
    category: 'Learning',
    iconName: 'Zap',
    color: 'text-amber-500 border-amber-200 dark:border-amber-500/30 bg-amber-500/10',
    bgLight: 'bg-amber-50/80 dark:bg-amber-950/30',
    goalValue: 1,
    unit: 'вопрос',
    getValue: (p) => p.masteredQuestionIds.length,
  },
  {
    id: 'ten_questions',
    title: 'Первые 10 вопросов',
    description: 'Освойте и закрепите 10 ключевых вопросов технической базы.',
    category: 'Learning',
    iconName: 'BookOpen',
    color: 'text-emerald-500 border-emerald-200 dark:border-emerald-500/30 bg-emerald-500/10',
    bgLight: 'bg-emerald-50/80 dark:bg-emerald-950/30',
    goalValue: 10,
    unit: 'вопросов',
    getValue: (p) => p.masteredQuestionIds.length,
  },
  {
    id: 'master_scholar',
    title: 'DevOps Эрудит',
    description: 'Изучите 30 вопросов по Linux, K8s, Docker, CI/CD и Облакам.',
    category: 'Learning',
    iconName: 'GraduationCap',
    color: 'text-purple-500 border-purple-200 dark:border-purple-500/30 bg-purple-500/10',
    bgLight: 'bg-purple-50/80 dark:bg-purple-950/30',
    goalValue: 30,
    unit: 'вопросов',
    getValue: (p) => p.masteredQuestionIds.length,
  },
  {
    id: 'weekly_streak',
    title: 'Недельный стрик',
    description: 'Поддерживайте ежедневный стрик подготовки 7 дней подряд.',
    category: 'Streak',
    iconName: 'Flame',
    color: 'text-orange-500 border-orange-200 dark:border-orange-500/30 bg-orange-500/10',
    bgLight: 'bg-orange-50/80 dark:bg-orange-950/30',
    goalValue: 7,
    unit: 'дней',
    getValue: (p) => p.dailyStreak,
  },
  {
    id: 'quiz_master',
    title: 'Мастер тестов',
    description: 'Сдайте 3+ теста с результатом отличника (80%+ правильных ответов).',
    category: 'Practice',
    iconName: 'CheckCircle2',
    color: 'text-emerald-500 border-emerald-200 dark:border-emerald-500/30 bg-emerald-500/10',
    bgLight: 'bg-emerald-50/80 dark:bg-emerald-950/30',
    goalValue: 3,
    unit: 'тестов',
    getValue: (p) => p.quizResults.filter(r => (r.score / r.totalQuestions) >= 0.8).length,
  },
  {
    id: 'bug_hunter',
    title: 'Охотник за багами (On-Call)',
    description: 'Успешно диагностируйте и устраните хотя бы 1 аварийный инцидент.',
    category: 'Practice',
    iconName: 'AlertTriangle',
    color: 'text-rose-500 border-rose-200 dark:border-rose-500/30 bg-rose-500/10',
    bgLight: 'bg-rose-50/80 dark:bg-rose-950/30',
    goalValue: 1,
    unit: 'авария',
    getValue: (p) => p.solvedIncidentIds ? p.solvedIncidentIds.length : 0,
  },
  {
    id: 'legend_architect',
    title: 'Архитектор Легенды',
    description: 'Составьте и сохраните структурированную легенду своего коммерческого опыта.',
    category: 'Career',
    iconName: 'Award',
    color: 'text-sky-500 border-sky-200 dark:border-sky-500/30 bg-sky-500/10',
    bgLight: 'bg-sky-50/80 dark:bg-sky-950/30',
    goalValue: 1,
    getValue: (p) => p.savedLegend ? 1 : 0,
  },
  {
    id: 'spaced_rep_pro',
    title: 'Карточный Гуру',
    description: 'Переведите 5 карточек в блоки долговременной памяти (Коробка 3 и выше).',
    category: 'Learning',
    iconName: 'BrainCircuit',
    color: 'text-teal-500 border-teal-200 dark:border-teal-500/30 bg-teal-500/10',
    bgLight: 'bg-teal-50/80 dark:bg-teal-950/30',
    goalValue: 5,
    unit: 'карточек',
    getValue: (p) => Object.values(p.flashcardBoxes || {}).filter(box => box >= 3).length,
  },
  {
    id: 'linux_master',
    title: 'Linux Специалист',
    description: 'Изучите 5 вопросов по системным вызовам, ядрам и оптимизации Linux.',
    category: 'Learning',
    iconName: 'Terminal',
    color: 'text-amber-600 border-amber-200 dark:border-amber-500/30 bg-amber-500/10',
    bgLight: 'bg-amber-50/80 dark:bg-amber-950/30',
    goalValue: 5,
    unit: 'вопросов',
    getValue: (p, questions) => {
      const linuxIds = new Set(questions.filter(q => q.category === 'linux').map(q => q.id));
      return p.masteredQuestionIds.filter(id => linuxIds.has(id)).length;
    },
  },
  {
    id: 'k8s_specialist',
    title: 'Kubernetes Инженер',
    description: 'Изучите 5 сложных вопросов по архитектуре и сети Kubernetes.',
    category: 'Learning',
    iconName: 'Layers',
    color: 'text-blue-500 border-blue-200 dark:border-blue-500/30 bg-blue-500/10',
    bgLight: 'bg-blue-50/80 dark:bg-blue-950/30',
    goalValue: 5,
    unit: 'вопросов',
    getValue: (p, questions) => {
      const k8sIds = new Set(questions.filter(q => q.category === 'k8s').map(q => q.id));
      return p.masteredQuestionIds.filter(id => k8sIds.has(id)).length;
    },
  },
  {
    id: 'bookmark_collector',
    title: 'Коллекционер Закладок',
    description: 'Сохраните 5 и более сложных вопросов в свои приватные закладки.',
    category: 'Learning',
    iconName: 'Bookmark',
    color: 'text-violet-500 border-violet-200 dark:border-violet-500/30 bg-violet-500/10',
    bgLight: 'bg-violet-50/80 dark:bg-violet-950/30',
    goalValue: 5,
    unit: 'закладок',
    getValue: (p) => p.bookmarkedQuestionIds.length,
  },
  {
    id: 'ai_interview_ready',
    title: 'AI Симуляция',
    description: 'Пройдите хотя бы 1 сессию голосового или текстового AI Собеседования.',
    category: 'Career',
    iconName: 'Bot',
    color: 'text-cyan-500 border-cyan-200 dark:border-cyan-500/30 bg-cyan-500/10',
    bgLight: 'bg-cyan-50/80 dark:bg-cyan-950/30',
    goalValue: 1,
    unit: 'сессия',
    getValue: (p) => p.completedInterviewSessionsCount || 0,
  }
];

export function evaluateAchievements(progress: UserProgress, questions: Question[]): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const rawVal = def.getValue(progress, questions);
    const currentValue = Math.min(rawVal, def.goalValue);
    const isUnlocked = currentValue >= def.goalValue;

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      category: def.category,
      iconName: def.iconName,
      color: def.color,
      bgLight: def.bgLight,
      currentValue,
      goalValue: def.goalValue,
      unit: def.unit,
      isUnlocked,
    };
  });
}
