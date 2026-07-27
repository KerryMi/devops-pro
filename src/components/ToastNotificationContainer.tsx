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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        let badgeBg = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
        let mainIcon = <Sparkles className="w-5 h-5 text-emerald-400" />;

        if (toast.type === 'achievement') {
          badgeBg = 'bg-amber-500/20 text-amber-500 border-amber-500/40';
          mainIcon = <Trophy className="w-5 h-5 text-amber-400" />;
        } else if (toast.type === 'level_up') {
          badgeBg = 'bg-purple-500/20 text-purple-400 border-purple-500/40';
          mainIcon = <Zap className="w-5 h-5 text-purple-400" />;
        } else if (toast.type === 'quest') {
          badgeBg = 'bg-blue-500/20 text-blue-400 border-blue-500/40';
          mainIcon = <CheckCircle2 className="w-5 h-5 text-blue-400" />;
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/95 dark:bg-[#121927]/95 border border-slate-700/80 dark:border-slate-800 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start space-x-3 transition-all animate-bounceIn relative overflow-hidden"
          >
            {/* Left Icon Pill */}
            <div className={`p-2.5 rounded-xl border ${badgeBg} shrink-0 mt-0.5`}>
              {toast.icon ? <span className="text-lg">{toast.icon}</span> : mainIcon}
            </div>

            {/* Content */}
            <div className="flex-1 pr-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {toast.type === 'achievement' ? '🏆 Награда разблокирована!' : toast.type === 'level_up' ? '⚡ Новый Уровень!' : '✨ Задание выполнено!'}
                </span>
                {toast.xpReward && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-black">
                    +{toast.xpReward} XP
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-white leading-tight">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
