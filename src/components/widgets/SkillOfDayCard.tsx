import React, { useState } from 'react';
import { getSkillOfTheDay, SKILLS_OF_THE_DAY, SkillOfDay } from '../../data/skillsOfDay';
import { 
  Zap, 
  Copy, 
  Check, 
  ArrowRight, 
  Shuffle, 
  Sparkles, 
  HelpCircle,
  Terminal,
  BookOpen
} from 'lucide-react';

interface SkillOfDayCardProps {
  onNavigate: (tab: any, filterCategory?: string) => void;
}

export const SkillOfDayCard: React.FC<SkillOfDayCardProps> = ({ onNavigate }) => {
  const [skillIndex, setSkillIndex] = useState<number>(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dayOfYear % SKILLS_OF_THE_DAY.length;
  });

  const [copied, setCopied] = useState(false);

  const currentSkill: SkillOfDay = SKILLS_OF_THE_DAY[skillIndex % SKILLS_OF_THE_DAY.length];

  const handleNextSkill = () => {
    setSkillIndex((prev) => (prev + 1) % SKILLS_OF_THE_DAY.length);
    setCopied(false);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'docker':
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'k8s':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'linux':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'cicd':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'terraform':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden transition-all duration-200 hover:border-amber-500/40 group">
      
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black shadow-xs">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center space-x-1">
              <span>НАВЫК ДНЯ</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Микро-концепция для интервью
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadgeStyle(currentSkill.category)}`}>
            {currentSkill.categoryLabel}
          </span>

          <button
            onClick={handleNextSkill}
            title="Показать случайную другую концепцию"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Другой</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Concept Title, Description & Interview Context */}
        <div className={`space-y-3.5 flex flex-col justify-between ${currentSkill.code ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="space-y-2">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentSkill.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentSkill.description}
            </p>
          </div>

          {/* Why Important Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5 mt-2">
            <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold block text-[11px] text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Зачем это на собеседовании:
              </span>
              <p className="text-[11px] sm:text-xs leading-relaxed">
                {currentSkill.whyImportant}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Code Snippet / Command Box & CTA Button */}
        <div className={`space-y-3 flex flex-col justify-between ${currentSkill.code ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {currentSkill.code && (
            <div className="rounded-xl bg-[#080d1a] border border-slate-800 p-3.5 font-mono text-[11px] text-slate-200 relative group/code overflow-x-auto flex-1">
              <div className="flex items-center justify-between text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-sans">
                <span className="flex items-center space-x-1">
                  <Terminal className="w-3 h-3 text-amber-400" />
                  <span>Пример / Команда:</span>
                </span>
                <button
                  onClick={() => handleCopyCode(currentSkill.code!)}
                  className="text-slate-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Скопировано' : 'Копировать'}</span>
                </button>
              </div>
              <pre className="text-emerald-400 font-medium whitespace-pre-wrap leading-relaxed selection:bg-amber-500/30">
                {currentSkill.code}
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
              Обновляется ежедневно
            </span>

            <button
              onClick={() => onNavigate(currentSkill.targetTab, currentSkill.targetCategoryFilter)}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer ml-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Изучить тему ({currentSkill.categoryLabel})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
