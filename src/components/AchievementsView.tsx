import React, { useState } from 'react';
import { UserProgress, Question } from '../types';
import { evaluateAchievements } from '../data/achievements';
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
  ArrowRight
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

  const achievements = evaluateAchievements(progress, questions);
  
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);

  // User Level Title based on unlocked achievements
  const getUserLevelTitle = (count: number) => {
    if (count >= 10) return 'Senior DevOps Architect';
    if (count >= 7) return 'Lead DevOps Engineer';
    if (count >= 4) return 'Middle DevOps Engineer';
    if (count >= 1) return 'Junior DevOps Practitioner';
    return 'DevOps Novice';
  };

  const rankTitle = getUserLevelTitle(unlockedCount);

  // Active Quests / Tasks to earn rewards
  const dailyQuests = [
    {
      id: 'quest-1',
      title: 'Пройти тренировку вопросов',
      description: 'Ответьте на вопросы по Kubernetes и CI/CD',
      progressText: `${progress.masteredQuestionIds.length} / 5 решено`,
      completed: progress.masteredQuestionIds.length >= 5,
      targetTab: 'questions'
    },
    {
      id: 'quest-2',
      title: 'Ликвидировать инцидент в Prod',
      description: 'Решите критическую ситуацию в симуляторе',
      progressText: `${(progress.solvedIncidentIds || []).length} / 1 решено`,
      completed: (progress.solvedIncidentIds || []).length >= 1,
      targetTab: 'incidents'
    },
    {
      id: 'quest-3',
      title: 'Изучить карточки памяти',
      description: 'Повторите ключевые DevOps термины',
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
    return matchesCat && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fadeIn">
      
      {/* SECTION 1: PROGRES & RANK (Top Card) */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Rank & Progress bar */}
        <div className="flex items-center space-x-5 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shrink-0">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Ваш карьерный ранг</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {rankTitle}
            </h2>
            <div className="flex items-center space-x-3 mt-2.5">
              <div className="w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">{overallPercent}% общ. прогресса</span>
            </div>
          </div>
        </div>

        {/* Right: Big Bold Count */}
        <div className="flex items-center space-x-6 shrink-0 bg-slate-50 dark:bg-slate-800/80 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-700 w-full md:w-auto justify-between md:justify-end">
          <div className="text-center md:text-right">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {unlockedCount}
            </div>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">из {totalCount} бейджей открыто</p>
          </div>
        </div>

      </div>

      {/* SECTION 2: ACTIVE TASKS & QUESTS (Задания) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
              Активные задания для новых наград
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Выполняйте для прокачки</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyQuests.map((quest) => (
            <div 
              key={quest.id}
              className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    Квест
                  </span>
                  {quest.completed ? (
                    <span className="flex items-center text-xs font-bold text-emerald-500 space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Выполнено</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-amber-500">
                      {quest.progressText}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {quest.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {quest.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate && onNavigate(quest.targetTab)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  quest.completed
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs'
                }`}
              >
                <span>{quest.completed ? 'Повторить' : 'Выполнить'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: REWARDS & BADGES (Награды) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'Все категории' },
              { id: 'Learning', label: 'Обучение' },
              { id: 'Practice', label: 'Практика' },
              { id: 'Streak', label: 'Стрик' },
              { id: 'Career', label: 'Карьера' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Все' },
              { id: 'unlocked', label: 'Открытые' },
              { id: 'in_progress', label: 'В процессе' }
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
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

        {/* Square Grid Tiles for Achievements/Rewards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.iconName] || Trophy;
            const progressPercent = Math.round((ach.currentValue / ach.goalValue) * 100);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center justify-between aspect-square relative group bg-white dark:bg-[#121927] ${
                  ach.isUnlocked
                    ? 'border-emerald-500/40 shadow-sm hover:border-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                {/* Corner Progress or Check */}
                <div className="absolute top-3 right-3">
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

                {/* Icon */}
                <div className={`mt-3 p-3.5 rounded-2xl border transition-all ${
                  ach.isUnlocked
                    ? `${ach.color} shadow-xs`
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  {ach.isUnlocked ? (
                    <IconComponent className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {/* Title & Short info */}
                <div className="w-full space-y-1">
                  <h4 className={`text-xs font-bold truncate ${
                    ach.isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {ach.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {ach.currentValue}/{ach.goalValue} {ach.unit || ''}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
