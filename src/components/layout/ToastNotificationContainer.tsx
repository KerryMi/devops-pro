import React from 'react';
import { Trophy, CheckCircle2, Zap, X, Info } from 'lucide-react';

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
      className="fixed top-[max(3.5rem,calc(env(safe-area-inset-top,24px)+12px))] sm:top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-2 pointer-events-none transition-all"
    >
      {toasts.map((toast) => {
        let badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        let mainIcon = <Info className="w-4 h-4 text-emerald-400" />;
        let typeText = 'Уведомление';

        if (toast.type === 'achievement') {
          badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
          mainIcon = <Trophy className="w-4 h-4 text-amber-400" />;
          typeText = 'Достижение';
        } else if (toast.type === 'level_up') {
          badgeBg = 'bg-purple-500/20 text-purple-400 border-purple-500/40';
          mainIcon = <Zap className="w-4 h-4 text-purple-400" />;
          typeText = 'Новый ранг';
        } else if (toast.type === 'quest') {
          badgeBg = 'bg-blue-500/20 text-blue-400 border-blue-500/40';
          mainIcon = <CheckCircle2 className="w-4 h-4 text-blue-400" />;
          typeText = 'Квест';
        } else if (toast.type === 'info') {
          badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          mainIcon = <Info className="w-4 h-4 text-emerald-400" />;
          typeText = 'Уведомление';
        }

        return (
          <div
            key={toast.id}
            className="w-[320px] sm:w-[380px] pointer-events-auto bg-slate-900/95 dark:bg-[#0d1424]/95 border border-slate-700/80 dark:border-amber-500/40 text-white px-3.5 py-2.5 rounded-2xl shadow-xl shadow-black/40 backdrop-blur-md flex items-center justify-between space-x-3 transition-all animate-slideDown shrink-0"
          >
            {/* Left Small Icon Pill */}
            <div className={`p-1.5 rounded-xl border ${badgeBg} shrink-0 flex items-center justify-center`}>
              {mainIcon}
            </div>

            {/* Content text */}
            <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 shrink-0">
                  {typeText}
                </span>

                {toast.xpReward && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-black shrink-0">
                    +{toast.xpReward} XP
                  </span>
                )}
              </div>

              <span className="text-xs font-extrabold text-white truncate">
                {toast.title}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
              title="Закрыть"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
