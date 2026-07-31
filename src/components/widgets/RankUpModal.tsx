import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X } from 'lucide-react';
import { ITRank } from '../../utils/gamification';

interface RankUpModalProps {
  rank: ITRank | null;
  onClose: () => void;
}

export const RankUpModal: React.FC<RankUpModalProps> = ({ rank, onClose }) => {
  if (!rank) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Content Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="relative max-w-[320px] w-full bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-xl overflow-hidden z-10 flex flex-col items-center text-center"
        >
          {/* Top light rays background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Header Trophy */}
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>

          <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 mb-0.5">
            Новый ранг!
          </span>

          <h2 className="text-lg font-black tracking-tight text-white leading-tight">
            Уровень {rank.level}
          </h2>

          {/* Meme Image Avatar Container */}
          <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-700 shadow-md my-3.5 relative shrink-0">
            {rank.memeImage ? (
              <img
                src={rank.memeImage}
                alt={rank.title}
                className="w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl">
                {rank.icon}
              </div>
            )}
          </div>

          {/* Rank Title and Subtitle */}
          <div className="space-y-0.5 mb-3">
            <h3 className="text-sm font-black text-amber-400 tracking-tight px-2 leading-tight">
              {rank.title}
            </h3>
            <p className="text-[10px] text-slate-400 italic font-medium px-4">
              «{rank.subtitle}»
            </p>
          </div>

          {/* Rank Description */}
          <p className="text-[11px] text-slate-400 leading-relaxed px-2 mb-4">
            {rank.description}
          </p>

          {/* Close/Acknowledge Button */}
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-98"
          >
            Отлично
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

