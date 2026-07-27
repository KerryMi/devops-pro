import React from 'react';
import { UserProgress, Question } from '../types';
import { calculateUserGamification } from '../utils/gamification';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Flame, 
  Lock, 
  Check, 
  Target
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
  const { rank, nextRank, totalXP, currentXPInRank, xpSpanInRank, progressPercent, achievements } = gamification;

  // Split into unlocked & in-progress
  const unlocked = achievements.filter(a => a.isUnlocked);
  const inProgress = achievements.filter(a => !a.isUnlocked);

  // Take top 2 next closest achievements
  const nextUp = inProgress
    .sort((a, b) => (b.currentValue / b.goalValue) - (a.currentValue / a.goalValue))
    .slice(0, 2);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#121927] to-slate-900 text-white border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-md relative overflow-hidden space-y-5">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 relative">
            <Trophy className="w-6 h-6" />
            {unseenAchievementsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-900 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Игровой Прогресс & Ранг
              </span>
              {unseenAchievementsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black animate-pulse">
                  +{unseenAchievementsCount} новых!
                </span>
              )}
            </div>
            <h3 className="text-lg font-black tracking-tight text-white flex items-center space-x-2 mt-0.5">
              <span>{rank.icon}</span>
              <span>{rank.title}</span>
            </h3>
          </div>
        </div>

        {/* Total XP Badge & Action */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-right">
            <div className="text-[9px] font-extrabold uppercase text-slate-400">Всего XP</div>
            <div className="text-sm font-black text-amber-400 font-mono">
              ⚡ {totalXP} XP
            </div>
          </div>

          <button
            onClick={() => onNavigate('achievements')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>Все ачивки ({unlocked.length}/{achievements.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-300 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Уровень {rank.level} из 10: <span className="text-amber-400">{rank.subtitle}</span></span>
          </span>
          <span className="font-mono text-slate-400 text-[11px] font-bold">
            {currentXPInRank} / {xpSpanInRank} XP ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {rank.level < 10 && (
          <p className="text-[11px] text-slate-400 font-medium">
            Следующее звание: <strong className="text-white font-bold">{nextRank.icon} {nextRank.title}</strong> ({xpSpanInRank - currentXPInRank} XP осталось)
          </p>
        )}
      </div>

      {/* Active Achievements Quests Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {nextUp.map((ach) => {
          const percent = Math.round((ach.currentValue / ach.goalValue) * 100);
          return (
            <div
              key={ach.id}
              onClick={() => onNavigate('achievements')}
              className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/50 p-3.5 rounded-xl transition-all cursor-pointer flex items-center space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 group-hover:text-amber-400 shrink-0">
                <Target className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-300">
                    {ach.title}
                  </h4>
                  <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0 ml-2">
                    +{ach.xpReward} XP
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{ach.description}</span>
                  <span className="font-bold">{ach.currentValue}/{ach.goalValue}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
