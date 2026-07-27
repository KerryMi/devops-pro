import { UserProgress, Question } from '../types';
import { evaluateAchievements } from '../data/achievements';

export interface ITRank {
  level: number;
  title: string;
  subtitle: string;
  minXP: number;
  maxXP: number;
  icon: string;
  memeImage: string;
  description: string;
  badgeBg: string;
  badgeTextColor: string;
}

export const FUNNY_IT_RANKS: ITRank[] = [
  {
    level: 1,
    title: 'Эникейщик на костылях',
    subtitle: 'Нажимаю «Перезагрузить» и молюсь',
    minXP: 0,
    maxXP: 299,
    icon: '🐣',
    memeImage: '/ranks/rank-1.jpg',
    description: 'Ты только что узнал, что Linux — это не просто пингвин, а rm -rf / — не команда очистки кэша.',
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/30',
    badgeTextColor: 'text-slate-600 dark:text-slate-300'
  },
  {
    level: 2,
    title: 'Поедатель Dockerfile',
    subtitle: '30 слоев в одном образе? Легко!',
    minXP: 300,
    maxXP: 599,
    icon: '🐳',
    memeImage: '/ranks/rank-2.jpg',
    description: 'Написал свой первый FROM alpine, умеешь пробрасывать порты и перезапускать контейнеры.',
    badgeBg: 'bg-sky-500/10 dark:bg-sky-500/20 border-sky-500/30',
    badgeTextColor: 'text-sky-600 dark:text-sky-400'
  },
  {
    level: 3,
    title: 'YAML-Шаман & Копипастер',
    subtitle: 'Считаю пробелы линейкой',
    minXP: 600,
    maxXP: 999,
    icon: '📜',
    memeImage: '/ranks/rank-3.jpg',
    description: 'Индейский шаманизм 21 века: один лишний пробел в YAML — и весь деплой превращается в пепел.',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30',
    badgeTextColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    level: 4,
    title: 'Сисадмин из 2000-х',
    subtitle: 'А у нас в серверной теплый чайник',
    minXP: 1000,
    maxXP: 1499,
    icon: '📼',
    memeImage: '/ranks/rank-4.jpg',
    description: 'Помнишь свитчи на 100 Мбит и обжимку витой пары. Права 777 — твой главный секрет успеха.',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30',
    badgeTextColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    level: 5,
    title: 'Повелитель Bash и Cron',
    subtitle: 'Автоматизирую даже варку кофе',
    minXP: 1500,
    maxXP: 2099,
    icon: '⚡',
    memeImage: '/ranks/rank-5.jpg',
    description: 'Пишешь седые пайплайны из grep, awk и sed прямо во сне. В Cron у тебя крутится полмикросервиса.',
    badgeBg: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/30',
    badgeTextColor: 'text-teal-600 dark:text-teal-400'
  },
  {
    level: 6,
    title: 'Охотник за CrashLoopBackOff',
    subtitle: 'Вижу $ kubectl logs — ставлю диагноз',
    minXP: 2100,
    maxXP: 2799,
    icon: '🔍',
    memeImage: '/ranks/rank-6.jpg',
    description: 'Падающие поды больше не вызывают паники. Ты умеешь смотреть dmesg и искать OOMKilled в 3 ночи.',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30',
    badgeTextColor: 'text-rose-600 dark:text-rose-400'
  },
  {
    level: 7,
    title: 'Архитектор Оверхеда',
    subtitle: '40 микросервисов для Hello World',
    minXP: 2800,
    maxXP: 3599,
    icon: '🏗️',
    memeImage: '/ranks/rank-7.jpg',
    description: 'Подключил Istio, Kafka, Vault, Prometheus и Grafana для вывода даты на сайт. Выглядит солидно!',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30',
    badgeTextColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    level: 8,
    title: 'Прод-Убийца (Деплой в Пятницу)',
    subtitle: 'Адреналин в 17:59 предвыходного дня',
    minXP: 3600,
    maxXP: 4499,
    icon: '💣',
    memeImage: '/ranks/rank-8.jpg',
    description: 'Пушить в мастер без тестов в пятницу перед уходом домой — твое личное экстремальное хобби.',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30',
    badgeTextColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    level: 9,
    title: 'Властелин Кубернетиса',
    subtitle: 'Управляю кластерами силой мысли',
    minXP: 4500,
    maxXP: 5499,
    icon: '☸️',
    memeImage: '/ranks/rank-9.png',
    description: 'CRD, Operator SDK, Helm-чарты и Custom CNI плагины подчиняются тебе с полуслова.',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30',
    badgeTextColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    level: 10,
    title: 'Бог Прод-Среды & Философ On-Call',
    subtitle: 'Прод упал? Включаю дзен и пью чай',
    minXP: 5500,
    maxXP: 999999,
    icon: '🧙‍♂️',
    memeImage: '/ranks/rank-10.png',
    description: 'Ты постиг высший технический дзен. Выходные безаварийны, CI зеленый, а HR бомбят офферами.',
    badgeBg: 'bg-amber-500/20 dark:bg-amber-500/30 border-amber-500/50',
    badgeTextColor: 'text-amber-500 dark:text-amber-400'
  }
];

export function calculateUserGamification(progress: UserProgress, questions: Question[]) {
  const masteredCount = (progress.masteredQuestionIds || []).length;
  const masteredXP = masteredCount * 25;

  const passedQuizzes = (progress.quizResults || []).filter(r => r.passed || (r.score / r.totalQuestions) >= 0.7);
  const quizXP = passedQuizzes.length * 60;

  const solvedIncidents = (progress.solvedIncidentIds || []).length;
  const incidentXP = solvedIncidents * 120;

  const legendXP = progress.savedLegend ? 200 : 0;

  const blitzHistory = Object.keys(progress.dailyBlitzHistory || {}).length;
  const blitzXP = blitzHistory * 40;

  const achievements = evaluateAchievements(progress, questions);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const achievementsXP = unlockedAchievements.length * 150;

  const totalXP = masteredXP + quizXP + incidentXP + legendXP + blitzXP + achievementsXP;

  let currentRank = FUNNY_IT_RANKS[0];
  for (const r of FUNNY_IT_RANKS) {
    if (totalXP >= r.minXP) {
      currentRank = r;
    }
  }

  const isMaxLevel = currentRank.level === FUNNY_IT_RANKS.length;
  const currentXPInRank = totalXP - currentRank.minXP;
  const xpSpanInRank = isMaxLevel ? 1000 : (currentRank.maxXP - currentRank.minXP + 1);
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((currentXPInRank / xpSpanInRank) * 100));

  const nextRank = isMaxLevel ? currentRank : FUNNY_IT_RANKS[currentRank.level];

  return {
    totalXP,
    level: currentRank.level,
    rank: currentRank,
    nextRank,
    currentXPInRank,
    xpSpanInRank,
    progressPercent,
    unlockedAchievementsCount: unlockedAchievements.length,
    totalAchievementsCount: achievements.length,
    achievements
  };
}
