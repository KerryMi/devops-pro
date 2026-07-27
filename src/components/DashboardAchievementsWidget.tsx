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
    <div className="h-full flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#121927] to-slate-900 text-white border border-slate-800 p-5 rounded-2xl shadow-md relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        {/* Left: Avatar */}
        <div className="shrink-0">
          <RankAvatar rank={rank} size="lg" className="shadow-md border border-amber-500/20" />
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">
              Уровень {rank.level}
            </span>
            <span className="text-slate-600 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              {totalXP} XP
            </span>
            {unseenAchievementsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[9px] font-black animate-pulse">
                +{unseenAchievementsCount}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-black tracking-tight text-white leading-tight mt-0.5">
            {rank.title}
          </h3>
          
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            {rank.subtitle}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span>Прогресс уровня</span>
          <span className="font-mono text-slate-300">
            {currentXPInRank}/{xpSpanInRank} XP ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Navigation Link */}
      <button
        onClick={() => onNavigate('achievements')}
        className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group relative z-10"
      >
        <span className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Все достижения ({unlocked.length}/{achievements.length})</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

