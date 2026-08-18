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
  xpReward: number;
  targetTab: string;
  targetCategory?: string;
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
    xpReward: 20,
    targetTab: 'questions',
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
    xpReward: 40,
    targetTab: 'questions',
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
    xpReward: 60,
    targetTab: 'questions',
    getValue: (p) => p.masteredQuestionIds.length,
  },
  {
    id: 'advanced_scholar',
    title: 'Профессиональный Студент',
    description: 'Изучите 60 вопросов по различным категориям нашей базы знаний.',
    category: 'Learning',
    iconName: 'Layers',
    color: 'text-rose-500 border-rose-200 dark:border-rose-500/30 bg-rose-500/10',
    bgLight: 'bg-rose-50/80 dark:bg-rose-950/30',
    goalValue: 60,
    unit: 'вопросов',
    xpReward: 80,
    targetTab: 'questions',
    getValue: (p) => p.masteredQuestionIds.length,
  },
  {
    id: 'ultimate_scholar',
    title: 'Ходячая Энциклопедия',
    description: 'Освойте 100 вопросов, чтобы стать неоспоримым DevOps-экспертом.',
    category: 'Learning',
    iconName: 'Sparkles',
    color: 'text-yellow-500 border-yellow-200 dark:border-yellow-500/30 bg-yellow-500/10',
    bgLight: 'bg-yellow-50/80 dark:bg-yellow-950/30',
    goalValue: 100,
    unit: 'вопросов',
    xpReward: 100,
    targetTab: 'questions',
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
    xpReward: 40,
    targetTab: 'dashboard',
    getValue: (p) => p.dailyStreak,
  },
  {
    id: 'marathon_streak',
    title: 'Марафонец',
    description: 'Подержите фокус и ежедневную активность 14 дней подряд.',
    category: 'Streak',
    iconName: 'Activity',
    color: 'text-red-500 border-red-200 dark:border-red-500/30 bg-red-500/10',
    bgLight: 'bg-red-50/80 dark:bg-red-950/30',
    goalValue: 14,
    unit: 'дней',
    xpReward: 80,
    targetTab: 'dashboard',
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
    xpReward: 50,
    targetTab: 'quizzes',
    getValue: (p) => p.quizResults.filter(r => (r.score >= 80 || (r.totalQuestions > 0 && (r.score / r.totalQuestions) >= 0.8))).length,
  },
  {
    id: 'quiz_legend',
    title: 'Герой тестирования',
    description: 'Завершите 10 тестов с отличным результатом (80%+ верных ответов).',
    category: 'Practice',
    iconName: 'Trophy',
    color: 'text-amber-500 border-amber-200 dark:border-amber-500/30 bg-amber-500/10',
    bgLight: 'bg-amber-50/80 dark:bg-amber-950/30',
    goalValue: 10,
    unit: 'тестов',
    xpReward: 100,
    targetTab: 'quizzes',
    getValue: (p) => p.quizResults.filter(r => (r.score >= 80 || (r.totalQuestions > 0 && (r.score / r.totalQuestions) >= 0.8))).length,
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
    xpReward: 50,
    targetTab: 'incidents',
    getValue: (p) => p.solvedIncidentIds ? p.solvedIncidentIds.length : 0,
  },
  {
    id: 'bug_terminator',
    title: 'Укротитель Сбоев',
    description: 'Успешно расследуйте и устраните 3 аварийных инцидента в продакшене.',
    category: 'Practice',
    iconName: 'Shield',
    color: 'text-violet-500 border-violet-200 dark:border-violet-500/30 bg-violet-500/10',
    bgLight: 'bg-violet-50/80 dark:bg-violet-950/30',
    goalValue: 3,
    unit: 'аварий',
    xpReward: 100,
    targetTab: 'incidents',
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
    unit: 'легенда',
    xpReward: 50,
    targetTab: 'legend',
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
    xpReward: 40,
    targetTab: 'flashcards',
    getValue: (p) => Object.values(p.flashcardBoxes || {}).filter(box => box >= 3).length,
  },
  {
    id: 'spaced_rep_master',
    title: 'Повелитель Памяти',
    description: 'Разместите не менее 15 карточек в долгосрочной памяти (Коробка 3 и выше).',
    category: 'Learning',
    iconName: 'Cpu',
    color: 'text-cyan-500 border-cyan-200 dark:border-cyan-500/30 bg-cyan-500/10',
    bgLight: 'bg-cyan-50/80 dark:bg-cyan-950/30',
    goalValue: 15,
    unit: 'карточек',
    xpReward: 80,
    targetTab: 'flashcards',
    getValue: (p) => Object.values(p.flashcardBoxes || {}).filter(box => box >= 3).length,
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
    xpReward: 20,
    targetTab: 'questions',
    getValue: (p) => p.bookmarkedQuestionIds.length,
  },
  {
    id: 'daily_blitz_master',
    title: 'Гроссмейстер Блица',
    description: 'Пройдите хотя бы 1 интерактивный ежедневный спринт-тест.',
    category: 'Practice',
    iconName: 'Zap',
    color: 'text-yellow-500 border-yellow-200 dark:border-yellow-500/30 bg-yellow-500/10',
    bgLight: 'bg-yellow-50/80 dark:bg-yellow-950/30',
    goalValue: 1,
    unit: 'спринт',
    xpReward: 20,
    targetTab: 'quizzes',
    getValue: (p) => Object.keys(p.dailyBlitzHistory || {}).length,
  },
  {
    id: 'daily_blitz_champion',
    title: 'Легенда Блица',
    description: 'Успешно завершите 5 ежедневных спринт-блиц тестов.',
    category: 'Practice',
    iconName: 'Bot',
    color: 'text-purple-500 border-purple-200 dark:border-purple-500/30 bg-purple-500/10',
    bgLight: 'bg-purple-50/80 dark:bg-purple-950/30',
    goalValue: 5,
    unit: 'спринтов',
    xpReward: 60,
    targetTab: 'quizzes',
    getValue: (p) => Object.keys(p.dailyBlitzHistory || {}).length,
  },
  {
    id: 'test_architect',
    title: 'Архитектор Тестирования',
    description: 'Пройдите хотя бы 1 технический тест без единой ошибки (100% балл) или завершите 2+ теста.',
    category: 'Practice',
    iconName: 'GraduationCap',
    color: 'text-indigo-500 border-indigo-200 dark:border-indigo-500/30 bg-indigo-500/10',
    bgLight: 'bg-indigo-50/80 dark:bg-indigo-950/30',
    goalValue: 1,
    unit: 'тест',
    xpReward: 40,
    targetTab: 'quizzes',
    getValue: (p) => {
      const perfectQuizzes = (p.quizResults || []).filter(r => (r.score >= 100 || (r.totalQuestions > 0 && (r.score / r.totalQuestions) >= 1.0))).length;
      const totalPassed = (p.quizResults || []).filter(r => (r.score >= 70 || (r.totalQuestions > 0 && (r.score / r.totalQuestions) >= 0.7))).length;
      return perfectQuizzes > 0 ? 1 : (totalPassed >= 2 ? 1 : 0);
    },
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
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'linux',
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
    xpReward: 40,
    targetTab: 'questions',
    targetCategory: 'k8s',
    getValue: (p, questions) => {
      const k8sIds = new Set(questions.filter(q => q.category === 'k8s').map(q => q.id));
      return p.masteredQuestionIds.filter(id => k8sIds.has(id)).length;
    },
  },
  {
    id: 'docker_specialist',
    title: 'Docker Эксперт',
    description: 'Изучите 5 вопросов по контейнеризации, многоэтапной сборке и оптимизации Docker.',
    category: 'Learning',
    iconName: 'Ship',
    color: 'text-sky-500 border-sky-200 dark:border-sky-500/30 bg-sky-500/10',
    bgLight: 'bg-sky-50/80 dark:bg-sky-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'docker',
    getValue: (p, questions) => {
      const dockerIds = new Set(questions.filter(q => q.category === 'docker').map(q => q.id));
      return p.masteredQuestionIds.filter(id => dockerIds.has(id)).length;
    },
  },
  {
    id: 'cicd_specialist',
    title: 'Мастер CI/CD',
    description: 'Изучите 5 вопросов по непрерывной интеграции, деплою, GitLab CI и GitHub Actions.',
    category: 'Learning',
    iconName: 'GitBranch',
    color: 'text-pink-500 border-pink-200 dark:border-pink-500/30 bg-pink-500/10',
    bgLight: 'bg-pink-50/80 dark:bg-pink-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'cicd',
    getValue: (p, questions) => {
      const cicdIds = new Set(questions.filter(q => q.category === 'cicd').map(q => q.id));
      return p.masteredQuestionIds.filter(id => cicdIds.has(id)).length;
    },
  },
  {
    id: 'terraform_specialist',
    title: 'Terraform Инженер',
    description: 'Изучите 5 вопросов по инфраструктуре как коду (IaC), стейтам и провайдерам Terraform.',
    category: 'Learning',
    iconName: 'Box',
    color: 'text-purple-600 border-purple-200 dark:border-purple-500/30 bg-purple-500/10',
    bgLight: 'bg-purple-50/80 dark:bg-purple-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'terraform',
    getValue: (p, questions) => {
      const tfIds = new Set(questions.filter(q => q.category === 'terraform').map(q => q.id));
      return p.masteredQuestionIds.filter(id => tfIds.has(id)).length;
    },
  },
  {
    id: 'cloud_specialist',
    title: 'Облачный Архитектор',
    description: 'Изучите 5 вопросов по провайдерам, сетям VPC, IAM и облачным архитектурным паттернам.',
    category: 'Learning',
    iconName: 'Cloud',
    color: 'text-indigo-500 border-indigo-200 dark:border-indigo-500/30 bg-indigo-500/10',
    bgLight: 'bg-indigo-50/80 dark:bg-indigo-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'cloud',
    getValue: (p, questions) => {
      const cloudIds = new Set(questions.filter(q => q.category === 'cloud').map(q => q.id));
      return p.masteredQuestionIds.filter(id => cloudIds.has(id)).length;
    },
  },
  {
    id: 'monitoring_specialist',
    title: 'Глаза Системы',
    description: 'Изучите 5 вопросов по Prometheus, Grafana, логированию и метрикам.',
    category: 'Learning',
    iconName: 'Activity',
    color: 'text-emerald-500 border-emerald-200 dark:border-emerald-500/30 bg-emerald-500/10',
    bgLight: 'bg-emerald-50/80 dark:bg-emerald-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'monitoring',
    getValue: (p, questions) => {
      const monitoringIds = new Set(questions.filter(q => q.category === 'monitoring').map(q => q.id));
      return p.masteredQuestionIds.filter(id => monitoringIds.has(id)).length;
    },
  },
  {
    id: 'ansible_specialist',
    title: 'Автоматизатор Ansible',
    description: 'Изучите 5 вопросов по плейбукам, ролям и инвентарям в Ansible.',
    category: 'Learning',
    iconName: 'Cpu',
    color: 'text-orange-600 border-orange-200 dark:border-orange-500/30 bg-orange-500/10',
    bgLight: 'bg-orange-50/80 dark:bg-orange-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'ansible',
    getValue: (p, questions) => {
      const ansibleIds = new Set(questions.filter(q => q.category === 'ansible').map(q => q.id));
      return p.masteredQuestionIds.filter(id => ansibleIds.has(id)).length;
    },
  },
  {
    id: 'networking_specialist',
    title: 'Сетевой Аналитик',
    description: 'Изучите 5 вопросов по сетевым протоколам, маршрутизации и безопасности (TCP/IP, DNS).',
    category: 'Learning',
    iconName: 'Globe',
    color: 'text-teal-600 border-teal-200 dark:border-teal-500/30 bg-teal-500/10',
    bgLight: 'bg-teal-50/80 dark:bg-teal-950/30',
    goalValue: 5,
    unit: 'вопросов',
    xpReward: 30,
    targetTab: 'questions',
    targetCategory: 'networking',
    getValue: (p, questions) => {
      const netIds = new Set(questions.filter(q => q.category === 'networking').map(q => q.id));
      return p.masteredQuestionIds.filter(id => netIds.has(id)).length;
    },
  }
];

export function evaluateAchievements(progress: UserProgress, questions: Question[]): Achievement[] {
  const claimed = progress.claimedAchievementIds || [];

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
      isClaimed: claimed.includes(def.id),
      xpReward: def.xpReward,
      targetTab: def.targetTab,
      targetCategory: def.targetCategory
    };
  });
}
