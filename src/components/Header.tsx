import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Award, 
  FileText, 
  Bot, 
  AlertTriangle, 
  Bookmark, 
  Flame, 
  Moon, 
  Sun,
  Code,
  Search,
  Menu,
  X,
  ChevronDown,
  Trophy
} from 'lucide-react';
import { SearchModal } from './SearchModal';
import { CategoryId } from '../types';

export type TabType = 
  | 'dashboard' 
  | 'questions' 
  | 'flashcards' 
  | 'quizzes' 
  | 'legend' 
  | 'resume' 
  | 'interview' 
  | 'incidents' 
  | 'cheatsheet'
  | 'achievements';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNavigate?: (tab: TabType, filterCategory?: CategoryId) => void;
  readinessScore: number;
  streak: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  masteredCount: number;
  totalQuestionsCount: number;
  unlockedAchievementsCount?: number;
  totalAchievementsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNavigate,
  readinessScore,
  streak,
  isDarkMode,
  setIsDarkMode,
  masteredCount,
  totalQuestionsCount,
  unlockedAchievementsCount = 0,
  totalAchievementsCount = 12
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tab: TabType, cat?: CategoryId) => {
    if (onNavigate) {
      onNavigate(tab, cat);
    } else {
      setActiveTab(tab);
    }
    setIsMobileMenuOpen(false);
  };

  // Nav items organized into logical groups
  const navGroups = [
    {
      groupName: 'Главная',
      items: [
        { id: 'dashboard' as TabType, label: 'Главная', icon: <Layers className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'Обучение & База',
      items: [
        { id: 'questions' as TabType, label: 'Вопросы', icon: <BookOpen className="w-4 h-4" />, badge: `${masteredCount}/${totalQuestionsCount}` },
        { id: 'flashcards' as TabType, label: 'Карточки', icon: <Bookmark className="w-4 h-4" /> },
        { id: 'quizzes' as TabType, label: 'Тесты', icon: <CheckCircle2 className="w-4 h-4" /> },
        { id: 'cheatsheet' as TabType, label: 'Шпаргалки', icon: <Code className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'Практика & Симуляции',
      items: [
        { id: 'incidents' as TabType, label: 'Аварии в Prod', icon: <AlertTriangle className="w-4 h-4" />, badge: 'New' },
        { id: 'interview' as TabType, label: 'AI Собеседование', icon: <Bot className="w-4 h-4" />, badge: 'AI' }
      ]
    },
    {
      groupName: 'Карьера & Резюме',
      items: [
        { id: 'achievements' as TabType, label: 'Достижения', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: `${unlockedAchievementsCount}/${totalAchievementsCount}` },
        { id: 'legend' as TabType, label: 'Легенда опыта', icon: <Award className="w-4 h-4" /> },
        { id: 'resume' as TabType, label: 'Резюме', icon: <FileText className="w-4 h-4" /> }
      ]
    }
  ];

  const allNavItems = navGroups.flatMap(g => g.items);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          
          {/* Top Row: Brand Logo, Global Search & User Indicators */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-4">
            
            {/* Logo */}
            <div 
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center space-x-2 cursor-pointer group shrink-0"
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-xs">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-white font-mono">DevOps<span className="text-emerald-500 dark:text-emerald-400">Pro</span></span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">Тренажер собеседований & Карьерный хаб</p>
              </div>
            </div>

            {/* Global Search Bar Trigger */}
            <div className="flex-1 min-w-0 max-w-[120px] xs:max-w-[180px] sm:max-w-xs md:max-w-md">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all shadow-inner group"
              >
                <div className="flex items-center space-x-1.5 min-w-0 truncate">
                  <Search className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate text-[11px] sm:text-xs">Поиск...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Widgets & Theme Toggle */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              
              {/* Achievements Badge Chip */}
              <button
                onClick={() => handleSelectTab('achievements')}
                className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold transition-all shrink-0"
                title="Ваши достижения и бейджи"
              >
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                <span className="hidden sm:inline">{unlockedAchievementsCount}/{totalAchievementsCount}</span>
                <span className="sm:hidden text-[11px] font-bold">{unlockedAchievementsCount}</span>
              </button>

              {/* Streak Counter */}
              <div className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold shrink-0">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-pulse shrink-0" />
                <span className="hidden xs:inline text-[11px] font-bold">{streak}d</span>
                <span className="xs:hidden text-[11px] font-bold">{streak}</span>
              </div>

              {/* Readiness Score */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                <span>Готовность:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{readinessScore}%</span>
                <div className="w-14 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ml-1">
                  <div 
                    className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
              </div>

              {/* Dark/Light toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                title={isDarkMode ? 'Включить светлую тему' : 'Включить темную тему'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 lg:hidden border border-slate-200 dark:border-slate-700"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>

          {/* Desktop Categorized Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 py-2 overflow-x-auto scrollbar-none border-t border-slate-200/80 dark:border-slate-800/80">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="flex items-center space-x-1 pr-3 mr-2 last:pr-0 last:mr-0 border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-emerald-500 dark:bg-emerald-400 text-slate-950 font-extrabold shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                          isActive ? 'bg-emerald-600 dark:bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-900/40 dark:bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <span className="font-bold text-slate-900 dark:text-white font-mono">Навигация DevOps Pro</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
                  {group.groupName}
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md' 
                            : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Bar for quick switching */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] font-medium text-slate-500 dark:text-slate-400">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`flex flex-col items-center space-y-0.5 p-1.5 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Главная</span>
        </button>

        <button
          onClick={() => handleSelectTab('questions')}
          className={`flex flex-col items-center space-y-0.5 p-1.5 rounded-xl transition-colors ${
            activeTab === 'questions' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Вопросы</span>
        </button>

        <button
          onClick={() => handleSelectTab('incidents')}
          className={`flex flex-col items-center space-y-0.5 p-1.5 rounded-xl transition-colors ${
            activeTab === 'incidents' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Аварии</span>
        </button>

        <button
          onClick={() => handleSelectTab('interview')}
          className={`flex flex-col items-center space-y-0.5 p-1.5 rounded-xl transition-colors ${
            activeTab === 'interview' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>AI Собесед.</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center space-y-0.5 p-1.5 rounded-xl hover:text-slate-800 dark:hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
          <span>Все меню</span>
        </button>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSelectTab}
      />
    </>
  );
};
