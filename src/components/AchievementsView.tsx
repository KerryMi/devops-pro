import React, { useState } from 'react';
import { UserProgress, Question } from '../types';
import { calculateUserGamification, FUNNY_IT_RANKS } from '../utils/gamification';
import { RankAvatar } from './RankAvatar';
import { 
  Award, 
  Zap, 
  BookOpen, 
  GraduationCap, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  Terminal, 
  Layers, 
  Bookmark, 
  Bot,
  Lock,
  Trophy,
  Check,
  Target,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';

interface AchievementsViewProps {
  progress: UserProgress;
  questions: Question[];
  onNavigate?: (tab: any, filterCategory?: any) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  BookOpen,
  GraduationCap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Award,
  BrainCircuit,
  Terminal,
  Layers,
  Bookmark,
  Bot
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  progress,
  questions,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRanksLadder, setShowRanksLadder] = useState<boolean>(false);

  const gamification = calculateUserGamification(progress, questions);
  const { 
    rank, 
    nextRank, 
    totalXP, 
    currentXPInRank, 
    xpSpanInRank, 
    progressPercent, 
    unlockedAchievementsCount, 
    totalAchievementsCount, 
    achievements 
  } = gamification;

  // Active Quests / Tasks
  const dailyQuests = [
    {
      id: 'quest-1',
      title: 'Освоить 5 вопросов из базы знаний',
      description: 'Ответьте на вопросы по Kubernetes, Docker и CI/CD',
      xpReward: 100,
      progressText: `${progress.masteredQuestionIds.length} / 5 решено`,
      completed: progress.masteredQuestionIds.length >= 5,
      targetTab: 'questions'
    },
    {
      id: 'quest-2',
      title: 'Ликвидировать аварийный инцидент',
      description: 'Диагностируйте проблему в симуляторе сбоев Prod',
      xpReward: 150,
      progressText: `${(progress.solvedIncidentIds || []).length} / 1 решено`,
      completed: (progress.solvedIncidentIds || []).length >= 1,
      targetTab: 'incidents'
    },
    {
      id: 'quest-3',
      title: 'Изучить 10 карточек с терминологией',
      description: 'Повторите важные определения через интервальные повторения',
      xpReward: 120,
      progressText: `${Object.keys(progress.flashcardBoxes || {}).length} / 10 изучено`,
      completed: Object.keys(progress.flashcardBoxes || {}).length >= 10,
      targetTab: 'flashcards'
    }
  ];

  // Filtering achievements
  const filteredAchievements = achievements.filter(a => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'unlocked' ? a.isUnlocked :
      !a.isUnlocked;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* SECTION 1: MAIN GAME RANK & LEVEL CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-[#121927] to-slate-900 text-white border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden space-y-6">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Main Rank Title & Badge */}
          <div className="flex items-start space-x-4">
            <RankAvatar rank={rank} size="xl" />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">
                  Уровень {rank.level} из 10
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {totalXP} XP Набрано
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {rank.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 italic font-medium">
                «{rank.subtitle}»
              </p>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed pt-1">
                {rank.description}
              </p>
            </div>
          </div>

          {/* XP Stat Box & Action */}
          <div className="shrink-0 flex flex-col justify-between space-y-3 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Открыто наград</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {unlockedAchievementsCount} / {totalAchievementsCount}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">XP Уровня:</span>
                <span className="text-amber-400 font-bold">{currentXPInRank} / {xpSpanInRank}</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowRanksLadder(!showRanksLadder)}
              className="w-full py-2 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>{showRanksLadder ? 'Скрыть лестницу рангов' : 'Посмотреть лестницу IT рангов'}</span>
              {showRanksLadder ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Expandable Ranks Ladder */}
        {showRanksLadder && (
          <div className="pt-4 border-t border-slate-800 space-y-3 animate-fadeIn relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Ранги</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FUNNY_IT_RANKS.map((r) => {
                const isCurrent = r.level === rank.level;
                const isPassed = r.level < rank.level;

                return (
                  <div
                    key={r.level}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/50 text-white ring-2 ring-amber-500/30'
                        : isPassed
                          ? 'bg-slate-800/60 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <RankAvatar rank={r} size="md" />
                        <div>
                          <div className="text-xs font-black flex items-center space-x-1">
                            <span>Ур. {r.level}: {r.title}</span>
                            {isPassed && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{r.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {r.minXP} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* SECTION 2: GAME QUESTS / TASKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
              Активные квесты для заработка XP
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Выполняйте для поднятия ранга</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyQuests.map((quest) => (
            <div 
              key={quest.id}
              className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                    +{quest.xpReward} XP
                  </span>
                  {quest.completed ? (
                    <span className="flex items-center text-xs font-bold text-emerald-500 space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Выполнено</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {quest.progressText}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {quest.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {quest.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate && onNavigate(quest.targetTab)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  quest.completed
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                }`}
              >
                <span>{quest.completed ? 'Повторить квест' : 'Выполнить квест'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: REWARDS & BADGES CATALOG */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'Все ачивки' },
              { id: 'Learning', label: 'Обучение' },
              { id: 'Practice', label: 'Практика' },
              { id: 'Streak', label: 'Стрик' },
              { id: 'Career', label: 'Карьера' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск ачивок..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
              {[
                { id: 'all', label: 'Все' },
                { id: 'unlocked', label: 'Открыты' },
                { id: 'in_progress', label: 'В процессе' }
              ].map(status => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${
                    statusFilter === status.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Square Grid Tiles for Achievements/Rewards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.iconName] || Trophy;
            const progressPercent = Math.round((ach.currentValue / ach.goalValue) * 100);

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative group bg-white dark:bg-[#121927] ${
                  ach.isUnlocked
                    ? 'border-emerald-500/40 shadow-sm hover:border-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                {/* Header Row inside card */}
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border transition-all ${
                    ach.isUnlocked
                      ? `${ach.color} shadow-xs`
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}>
                    {ach.isUnlocked ? (
                      <IconComponent className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                      +{ach.xpReward} XP
                    </span>
                    {ach.isUnlocked ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {progressPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5 my-3">
                  <h4 className={`text-sm font-bold ${
                    ach.isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {ach.description}
                  </p>
                </div>

                {/* Progress Bar & Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                    <span>Прогресс:</span>
                    <span>{ach.currentValue} / {ach.goalValue} {ach.unit || ''}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${ach.isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
