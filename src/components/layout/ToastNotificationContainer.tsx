import React, { useState } from 'react';
import { Trophy, CheckCircle2, Zap, X, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  // Always display only the latest toast so notifications replace each other gracefully
  const currentToast = toasts[toasts.length - 1];

  let themeConfig = {
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    iconBg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    dotBg: 'bg-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    mainIcon: <Info className="w-5 h-5 text-emerald-400" />,
    typeText: 'Уведомление'
  };

  if (currentToast.type === 'achievement') {
    themeConfig = {
      badgeBg: 'bg-amber-500/15 border-amber-500/35 text-amber-400',
      iconBg: 'from-amber-500/25 to-yellow-500/10 border-amber-500/40 text-amber-400',
      dotBg: 'bg-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.18)',
      mainIcon: <Trophy className="w-5 h-5 text-amber-400" />,
      typeText: 'Достижение'
    };
  } else if (currentToast.type === 'level_up') {
    themeConfig = {
      badgeBg: 'bg-purple-500/15 border-purple-500/35 text-purple-400',
      iconBg: 'from-purple-500/25 to-indigo-500/10 border-purple-500/40 text-purple-400',
      dotBg: 'bg-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.18)',
      mainIcon: <Zap className="w-5 h-5 text-purple-400" />,
      typeText: 'Новый ранг'
    };
  } else if (currentToast.type === 'quest') {
    themeConfig = {
      badgeBg: 'bg-blue-500/15 border-blue-500/35 text-blue-400',
      iconBg: 'from-blue-500/25 to-cyan-500/10 border-blue-500/40 text-blue-400',
      dotBg: 'bg-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.18)',
      mainIcon: <CheckCircle2 className="w-5 h-5 text-blue-400" />,
      typeText: 'Квест'
    };
  }

  return (
    <div className="fixed top-[max(0.75rem,calc(env(safe-area-inset-top,12px)+6px))] left-1/2 -translate-x-1/2 z-[100] w-full px-3 sm:px-4 flex justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentToast.id}
          initial={{ y: -45, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -35, opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.6, bottom: 0.2 }}
          onDragEnd={(_, info) => {
            // Swipe UP or fast drag to dismiss
            if (info.offset.y < -25 || info.velocity.y < -200) {
              onDismiss(currentToast.id);
            }
          }}
          style={{
            boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 25px 0 ${themeConfig.glowColor}`
          }}
          className="w-full sm:w-[420px] max-w-[420px] pointer-events-auto bg-slate-900/95 dark:bg-[#0c1220]/95 border border-slate-700/80 dark:border-slate-700/60 text-white rounded-[24px] p-3.5 backdrop-blur-2xl touch-pan-y select-none cursor-grab active:cursor-grabbing transition-colors group relative overflow-hidden"
        >
          {/* Bento Sub-grid Top Swipe Handle & Header */}
          <div className="flex flex-col space-y-2">
            {/* Mobile Swipe Handle Indicator */}
            <div className="w-9 h-1 rounded-full bg-slate-600/40 dark:bg-slate-500/30 mx-auto transition-colors group-hover:bg-slate-400/50" />

            {/* Top Metadata Row */}
            <div className="flex items-center justify-between text-xs font-medium px-0.5">
              <div className="flex items-center space-x-2">
                {/* App Brand Pill */}
                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-800/90 dark:bg-slate-800/80 border border-slate-700/60 text-[10px] font-bold text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${themeConfig.dotBg} animate-pulse`} />
                  <span>DevOps Pro</span>
                </div>

                {/* Category Type Badge */}
                <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${themeConfig.badgeBg}`}>
                  {themeConfig.typeText}
                </div>
              </div>

              {/* Time & Close */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400 font-medium">сейчас</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(currentToast.id);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Закрыть"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bento Main Content Container */}
            <div className="flex items-center space-x-3 bg-slate-800/40 dark:bg-slate-900/60 border border-slate-700/40 dark:border-slate-800/80 rounded-2xl p-2.5">
              {/* Bento Left Icon Squircle Cell */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${themeConfig.iconBg} border flex items-center justify-center shrink-0 shadow-sm`}>
                {themeConfig.mainIcon}
              </div>

              {/* Bento Middle Content Cell */}
              <div className="flex flex-col min-w-0 flex-1 pr-1">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight truncate">
                    {currentToast.title}
                  </h5>

                  {currentToast.xpReward && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-extrabold shrink-0 flex items-center space-x-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-400 inline" />
                      <span>+{currentToast.xpReward} XP</span>
                    </span>
                  )}
                </div>

                {currentToast.message && (
                  <p className="text-[11px] sm:text-xs text-slate-300/80 leading-snug line-clamp-2 mt-0.5 font-normal">
                    {currentToast.message}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Swipe Hint */}
            <div className="text-[9px] text-slate-400 dark:text-slate-500 text-center font-medium tracking-wider uppercase opacity-75 sm:hidden">
              Свайп вверх, чтобы скрыть
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


