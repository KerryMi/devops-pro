import React from 'react';
import { UserProgress, Question } from '../types';
import { calculateUserGamification } from '../utils/gamification';
import { RankAvatar } from './RankAvatar';
import { 
  Trophy, 
  ArrowRight, 
  Zap 
} from 'lucide-react';

interface DashboardAchievementsWidgetProps {
  progress: UserProgress;
  questions: Question[];
  onNavigate: (tab: any) => void;
  unseenAchievementsCount?: number;
}

export const DashboardAchievementsWidget: React.FC<DashboardAchievementsWidgetProps> = ({
  progress,
  questions,
  onNavigate,
  unseenAchievementsCount = 0
}) => {
  const gamification = calculateUserGamification(progress, questions);
  const { rank, totalXP, currentXPInRank, xpSpanInRank, progressPercent, achievements } = gamification;

  const unlocked = achievements.filter(a => a.isUnlocked);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-[#121927] dark:to-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 md:gap-5 relative z-10 md:py-2">
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
            {unseenAchievementsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-500 dark:text-rose-400 text-[9px] md:text-[10px] font-black animate-pulse">
                +{unseenAchievementsCount}
              </span>
            )}
          </div>
          
          <h3 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mt-0.5">
            {rank.title}
          </h3>
          
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate md:whitespace-normal mt-0.5">
            {rank.subtitle}
          </p>
        </div>
      </div>

      {/* Push progress bar down on desktop to fill empty space and place it closer to footer */}
      <div className="flex-grow hidden md:block" />

      {/* Progress Bar */}
      <div className="mt-6 md:mt-0 md:mb-5 space-y-1.5 relative z-10">
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
        </span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

