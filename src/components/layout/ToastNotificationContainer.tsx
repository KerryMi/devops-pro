import React from 'react';
import { Trophy, CheckCircle2, Zap, X, Info } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  xpReward?: number;
  type?: 'achievement' | 'quest' | 'level_up' | 'info';
  icon?: string;
}

interface ToastNotificationContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastNotificationContainer: React.FC<ToastNotificationContainerProps> = ({
  toasts,
  onDismiss
}) => {
  if (!toasts || toasts.length === 0) return null;

  // Always display only the latest toast so notifications replace each other instead of stacking
  const currentToast = toasts[toasts.length - 1];

  let iconContainerBg = 'from-emerald-500/30 to-emerald-600/10 text-emerald-400 border-emerald-500/30';
  let mainIcon = <Info className="w-5 h-5 text-emerald-400" />;
  let typeText = 'Уведомление';

  if (currentToast.type === 'achievement') {
    iconContainerBg = 'from-amber-500/30 to-amber-600/10 text-amber-400 border-amber-500/40';
    mainIcon = <Trophy className="w-5 h-5 text-amber-400" />;
    typeText = 'Достижение';
  } else if (currentToast.type === 'level_up') {
    iconContainerBg = 'from-purple-500/30 to-purple-600/10 text-purple-400 border-purple-500/40';
    mainIcon = <Zap className="w-5 h-5 text-purple-400" />;
    typeText = 'Новый ранг';
  } else if (currentToast.type === 'quest') {
    iconContainerBg = 'from-blue-500/30 to-blue-600/10 text-blue-400 border-blue-500/40';
    mainIcon = <CheckCircle2 className="w-5 h-5 text-blue-400" />;
    typeText = 'Квест';
  }

  return (
    <div 
      className="fixed top-[max(1rem,calc(env(safe-area-inset-top,16px)+8px))] left-1/2 -translate-x-1/2 z-[100] w-full px-4 flex justify-center pointer-events-none transition-all"
    >
      <div
        key={currentToast.id}
        className="w-full sm:w-[410px] max-w-[410px] pointer-events-auto bg-[#1c1c1e]/90 text-white border border-white/20 dark:border-white/15 rounded-[22px] p-3 shadow-2xl shadow-black/60 backdrop-blur-2xl backdrop-saturate-150 flex items-start space-x-3 transition-all animate-slideDown"
      >
        {/* iOS-Style Squircle Icon Container */}
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${iconContainerBg} border flex items-center justify-center shrink-0 shadow-inner mt-0.5`}>
          {mainIcon}
        </div>

        {/* Content Area */}
        <div className="flex flex-col min-w-0 flex-1 py-0.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-0.5">
            <span className="flex items-center space-x-1">
              <span className="font-bold text-slate-300">DevOps Pro</span>
              <span>•</span>
              <span className="text-amber-400/90 font-semibold">{typeText}</span>
            </span>
            <span className="text-[10px] text-slate-500">сейчас</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h5 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate leading-tight">
              {currentToast.title}
            </h5>
            {currentToast.xpReward && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-bold shrink-0">
                +{currentToast.xpReward} XP
              </span>
            )}
          </div>

          {currentToast.message && (
            <p className="text-[11px] sm:text-xs text-slate-300/90 leading-snug line-clamp-2 mt-1">
              {currentToast.message}
            </p>
          )}
        </div>

        {/* Minimal iOS Close Button */}
        <button
          onClick={() => onDismiss(currentToast.id)}
          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
          title="Закрыть"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

