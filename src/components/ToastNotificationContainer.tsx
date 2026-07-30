import React from 'react';
import { Trophy, Sparkles, CheckCircle2, Zap, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
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
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-2 max-w-lg w-[calc(100%-2rem)] sm:w-auto pointer-events-none transition-all"
      style={{ top: 'calc(4.5rem + env(safe-area-inset-top, 0px))' }}
    >
      {toasts.map((toast) => {
        let badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        let mainIcon = <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
        let typeText = '✨ Достижение!';

        if (toast.type === 'achievement') {
          badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
          mainIcon = <Trophy className="w-3.5 h-3.5 text-amber-400" />;
          typeText = '🏆 Достижение!';
        } else if (toast.type === 'level_up') {
          badgeBg = 'bg-purple-500/20 text-purple-400 border-purple-500/40';
          mainIcon = <Zap className="w-3.5 h-3.5 text-purple-400" />;
          typeText = '⚡ Уровень!';
        } else if (toast.type === 'quest') {
          badgeBg = 'bg-blue-500/20 text-blue-400 border-blue-500/40';
          mainIcon = <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />;
          typeText = '🎯 Квест!';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/90 dark:bg-[#0d1424]/95 border border-slate-700/80 dark:border-amber-500/30 text-white px-3.5 py-2 rounded-full shadow-lg shadow-black/30 backdrop-blur-md flex items-center space-x-2.5 transition-all animate-slideDown max-w-full"
          >
            {/* Left Small Icon Pill */}
            <div className={`p-1.5 rounded-full border ${badgeBg} shrink-0 flex items-center justify-center`}>
              {toast.icon ? <span className="text-xs">{toast.icon}</span> : mainIcon}
            </div>

            {/* Content text */}
            <div className="flex items-center space-x-2 min-w-0 pr-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 shrink-0 hidden sm:inline">
                {typeText}
              </span>

              <span className="text-xs font-extrabold text-white truncate max-w-[200px] sm:max-w-[280px]">
                {toast.title}
              </span>

              {toast.xpReward && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-black shrink-0">
                  +{toast.xpReward} XP
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer shrink-0"
              title="Закрыть"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
