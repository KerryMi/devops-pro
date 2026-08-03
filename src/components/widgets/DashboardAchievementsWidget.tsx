import React from 'react';
import { UserProgress, Question, Achievement } from '../../types';
import { calculateUserGamification } from '../../utils/gamification';
import { RankAvatar } from './RankAvatar';
import { 
  Trophy, 
  ArrowRight, 
  Target,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface DashboardAchievementsWidgetProps {
  progress: UserProgress;
  questions: Question[];
  onNavigate: (tab: any, filterCategory?: string) => void;
  unseenAchievementsCount?: number;
}

function findNearestQuest(progress: UserProgress, questions: Question[], achievements: Achievement[]) {
  const dailyQuests = [
    {
      id: 'quest-1',
      title: 'Освоить 5 вопросов из базы знаний',
      description: 'Ответьте на вопросы по Kubernetes, Docker и CI/CD',
      xpReward: 50,
      currentValue: progress.masteredQuestionIds.length,
      goalValue: 5,
      completed: progress.masteredQuestionIds.length >= 5,
      targetTab: 'questions'
    },
    {
      id: 'quest-2',
      title: 'Ликвидировать аварийный инцидент',
      description: 'Диагностируйте проблему в симуляторе сбоев Prod',
      xpReward: 60,
      currentValue: (progress.solvedIncidentIds || []).length,
      goalValue: 1,
      completed: (progress.solvedIncidentIds || []).length >= 1,
      targetTab: 'incidents'
    },
    {
      id: 'quest-3',
      title: 'Изучить 10 карточек с терминологией',
      description: 'Повторите важные определения через флешкарточки',
      xpReward: 100,
      currentValue: Object.keys(progress.flashcardBoxes || {}).length,
      goalValue: 10,
      completed: Object.keys(progress.flashcardBoxes || {}).length >= 10,
      targetTab: 'flashcards'
    },
    {
      id: 'quest-4',
      title: 'Пройти Ежедневный Блиц',
      description: 'Пройдите быстрый тест в игровом формате',
      xpReward: 50,
      currentValue: Object.keys(progress.dailyBlitzHistory || {}).length,
      goalValue: 1,
      completed: Object.keys(progress.dailyBlitzHistory || {}).length >= 1,
      targetTab: 'dashboard'
    },
    {
      id: 'quest-5',
      title: 'Сдать Тест на Отлично',
      description: 'Пройдите любой тематический тест (≥80%)',
      xpReward: 100,
      currentValue: (progress.quizResults || []).filter(r => r.totalQuestions > 0 && (r.score / r.totalQuestions) >= 0.8).length,
      goalValue: 1,
      completed: (progress.quizResults || []).some(r => r.totalQuestions > 0 && (r.score / r.totalQuestions) >= 0.8),
      targetTab: 'quizzes'
    },
    {
      id: 'quest-6',
      title: 'Собрать Легенду Опыта',
      description: 'Заполните и сохраните легенду для резюме',
      xpReward: 100,
      currentValue: progress.savedLegend ? 1 : 0,
      goalValue: 1,
      completed: !!progress.savedLegend,
      targetTab: 'legend'
    }
  ];

  const uncompletedDaily = dailyQuests
    .filter(q => !q.completed)
    .map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      xpReward: q.xpReward,
      currentValue: q.currentValue,
      goalValue: q.goalValue,
      progressRatio: Math.min(1, q.currentValue / q.goalValue),
      progressText: `${q.currentValue}/${q.goalValue}`,
      targetTab: q.targetTab,
      targetCategory: undefined as string | undefined
    }));

  const uncompletedAchievements = achievements
    .filter(a => !a.isUnlocked)
    .map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      xpReward: a.xpReward,
      currentValue: a.currentValue,
      goalValue: a.goalValue,
      progressRatio: Math.min(1, a.currentValue / a.goalValue),
      progressText: `${a.currentValue}/${a.goalValue}${a.unit ? ' ' + a.unit : ''}`,
      targetTab: a.targetTab,
      targetCategory: a.targetCategory
    }));

  const allCandidates = [...uncompletedDaily, ...uncompletedAchievements];
  if (allCandidates.length === 0) return null;

  allCandidates.sort((a, b) => {
    if (b.progressRatio !== a.progressRatio) {
      return b.progressRatio - a.progressRatio;
    }
    return b.xpReward - a.xpReward;
  });

  return allCandidates[0];
}

export const DashboardAchievementsWidget: React.FC<DashboardAchievementsWidgetProps> = ({
  progress,
  questions,
  onNavigate,
  unseenAchievementsCount = 0
}) => {
  const gamification = calculateUserGamification(progress, questions);
  const { 
    rank, 
    totalXP, 
    currentXPInRank, 
    xpSpanInRank, 
    progressPercent, 
    achievements
  } = gamification;

  const unlocked = achievements.filter(a => a.isUnlocked);
  const nextQuest = findNearestQuest(progress, questions, achievements);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-[#121927] dark:to-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 md:gap-5 relative z-10 md:py-1">
        {/* Left: Avatar */}
        <div className="shrink-0">
          <RankAvatar 
            rank={rank} 
            size="lg" 
            className="md:w-20 md:h-20 md:text-4xl md:rounded-3xl shadow-md border border-amber-500/20" 
          />
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0 md:space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 font-mono">
              Уровень {rank.level}
            </span>
            <span className="text-slate-300 dark:text-slate-600 text-[10px] md:text-xs">•</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
              {totalXP} XP
            </span>
          </div>
          
          <h3 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mt-0.5">
            {rank.title}
          </h3>
          
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate md:whitespace-normal mt-0.5">
            {rank.subtitle}
          </p>
        </div>
      </div>

      {/* Desktop Only Next Quest Container (hidden on mobile to keep widget compact) */}
      <div className="hidden md:flex flex-col my-3.5 p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 relative z-10 group transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">
              Ближайший квест
            </span>
          </div>

          {nextQuest && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-extrabold shrink-0 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>+{nextQuest.xpReward} XP</span>
            </span>
          )}
        </div>

        {nextQuest ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">
                {nextQuest.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {nextQuest.description}
              </p>
              
              <div className="flex items-center space-x-2 pt-0.5">
                <div className="flex-1 max-w-[130px] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((nextQuest.currentValue / nextQuest.goalValue) * 100))}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                  {nextQuest.progressText}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate(nextQuest.targetTab, nextQuest.targetCategory)}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center space-x-1 shrink-0 shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Выполнить</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 py-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Все квесты и достижения выполнены!</span>
          </div>
        )}
      </div>

      <div className="flex-grow hidden md:block" />

      {/* Progress Bar */}
      <div className="mt-4 md:mt-0 md:mb-4 space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Прогресс уровня</span>
          <span className="font-mono text-slate-600 dark:text-slate-300">
            {currentXPInRank}/{xpSpanInRank} XP ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Navigation Link */}
      <button
        onClick={() => onNavigate('achievements')}
        className="mt-auto md:mt-0 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer group relative z-10"
      >
        <span className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Все достижения ({unlocked.length}/{achievements.length})</span>
          {unseenAchievementsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1" title="Есть новые достижения!" />
          )}
        </span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

