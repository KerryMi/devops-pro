import React from 'react';
import { Terminal, Github, Send, ArrowUp, ExternalLink } from 'lucide-react';
import { TabType } from './Header';
import { CategoryId } from '../../types';

interface FooterProps {
  onNavigate: (tab: TabType, cat?: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-4 sm:mt-8 lg:mt-10 pb-[calc(5.5rem+env(safe-area-inset-bottom,16px))] lg:pb-8 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 transition-colors">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-mono">
              DevOps<span className="text-emerald-500">Pro</span>
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-800" />

          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center space-x-1">
            <span>© 2026 DevOps Pro by Karina with</span>
            <span className="text-emerald-500 text-sm">💚</span>
          </p>
        </div>

        {/* Action Buttons & Social Links */}
        <div className="flex items-center space-x-2.5">
          <a
            href="https://t.me/KerryMind"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all font-medium text-xs group"
          >
            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Telegram</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href="https://github.com/KerryMi/devops-pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-medium text-xs group"
          >
            <Github className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            onClick={scrollToTop}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-colors border border-slate-200 dark:border-slate-700 ml-1"
            title="Наверх"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
