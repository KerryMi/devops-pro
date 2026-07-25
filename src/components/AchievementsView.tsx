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
  Sparkles,
  Trophy,
  Filter,
  Check
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
    if (count >= 10) return { title: 'Senior DevOps Architect', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50' };
    if (count >= 7) return { title: 'Lead DevOps Engineer', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40' };
    if (count >= 4) return { title: 'Middle DevOps Engineer', color: 'text-emerald-500 bg-emerald-950/30 border-emerald-500/30' };
    if (count >= 1) return { title: 'Junior DevOps Practitioner', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' };
    return { title: 'DevOps Novice', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
  };

  const userLevel = getUserLevelTitle(unlockedCount);

  // Filtering
  const filteredAchievements = achievements.filter(a => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'unlocked' ? a.isUnlocked :
      !a.isUnlocked;
    return matchesCat && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-500/20">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>DevOps Achievements System</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Система Достижений и Бейджей
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Отслеживайте свой карьерный рост, выполняйте челленджи и получайте бейджи за изучение вопросов, тесты и решение инцидентов.
            </p>
          </div>

          {/* User Rank & Score Card */}
          <div className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shrink-0 flex flex-col items-center justify-center min-w-[220px] text-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Ваш Карьерный Ранг</span>
            <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${userLevel.color}`}>
              {userLevel.title}
            </div>

            <div className="w-full pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Открыто бейджей:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400">{unlockedCount} / {totalCount} ({overallPercent}%)</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-700 rounded-full"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Все ({achievements.length})
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'unlocked'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Открытые ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'in_progress'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              В процессе ({totalCount - unlockedCount})
            </button>
          </div>

        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const IconComponent = ICON_MAP[ach.iconName] || Trophy;
          const progressPercent = Math.round((ach.currentValue / ach.goalValue) * 100);

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                ach.isUnlocked
                  ? `${ach.bgLight} border-slate-200/80 dark:border-slate-800 shadow-xs`
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 opacity-80'
              }`}
            >
              {/* Top Header Row of Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {/* Badge Icon */}
                  <div className={`p-3 rounded-2xl border transition-transform ${
                    ach.isUnlocked
                      ? `${ach.color} shadow-xs scale-105`
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}>
                    {ach.isUnlocked ? (
                      <IconComponent className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <h3 className={`font-extrabold text-sm ${
                      ach.isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {ach.title}
                    </h3>
                    <span className="inline-block text-[10px] uppercase font-bold text-slate-400">
                      {ach.category === 'Learning' ? 'Обучение' :
                       ach.category === 'Practice' ? 'Практика' :
                       ach.category === 'Streak' ? 'Стрик' : 'Карьера'}
                    </span>
                  </div>
                </div>

                {/* Status Badge Tag */}
                {ach.isUnlocked ? (
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Получено</span>
                  </span>
                ) : (
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {progressPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {ach.description}
              </p>

              {/* Progress Bar & Counter */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span>Прогресс:</span>
                  <span className={ach.isUnlocked ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'}>
                    {ach.currentValue} / {ach.goalValue} {ach.unit || ''}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      ach.isUnlocked ? 'bg-emerald-500' : 'bg-emerald-600/70'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
