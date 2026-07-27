import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Award, 
  FileText, 
  AlertTriangle, 
  Bookmark, 
  Code,
  Trophy,
  Menu,
  X,
  Sun,
  Moon,
  User,
  ShieldCheck
} from 'lucide-react';
import { SearchModal } from './SearchModal';
import { CategoryId } from '../types';

import { User as FirebaseUser } from 'firebase/auth';

export type TabType = 
  | 'dashboard' 
  | 'questions' 
  | 'flashcards' 
  | 'quizzes' 
  | 'legend' 
  | 'resume' 
  | 'incidents' 
  | 'cheatsheet'
  | 'achievements'
  | 'profile'
  | 'admin';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNavigate?: (tab: TabType, filterCategory?: CategoryId) => void;
  masteredCount: number;
  totalQuestionsCount: number;
  unlockedAchievementsCount?: number;
  totalAchievementsCount?: number;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  currentUser?: FirebaseUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNavigate,
  masteredCount,
  totalQuestionsCount,
  unlockedAchievementsCount = 0,
  totalAchievementsCount = 12,
  isSearchOpen,
  setIsSearchOpen,
  isDarkMode,
  setIsDarkMode,
  currentUser = null
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const handleSelectTab = (tab: TabType, cat?: CategoryId) => {
    if (onNavigate) {
      onNavigate(tab, cat);
    } else {
      setActiveTab(tab);
    }
    setIsMobileMenuOpen(false);
  };

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
        { id: 'incidents' as TabType, label: 'Аварии в Prod', icon: <AlertTriangle className="w-4 h-4" />, badge: 'New' }
      ]
    },
    {
      groupName: 'Карьера & Резюме',
      items: [
        { id: 'achievements' as TabType, label: 'Достижения', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: `${unlockedAchievementsCount}/${totalAchievementsCount}` },
        { id: 'legend' as TabType, label: 'Легенда опыта', icon: <Award className="w-4 h-4" /> },
        { id: 'resume' as TabType, label: 'Резюме', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'Управление',
      items: [
        { id: 'admin' as TabType, label: 'Админка', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, badge: 'Admin' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Top Minimalist Header */}
      <div className="block lg:hidden px-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-2 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#121927] transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 select-none cursor-pointer" onClick={() => handleSelectTab('dashboard')}>
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-mono">
              DevOps<span className="text-emerald-500">Pro</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSelectTab('profile')}
              className={`p-1.5 px-2 rounded-lg border text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentUser 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title={currentUser ? currentUser.email || 'Профиль' : 'Войти в личный кабинет'}
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-[10px]">
                {currentUser?.email ? currentUser.email[0].toUpperCase() : <User className="w-3 h-3" />}
              </div>
              {currentUser && (
                <span className="max-w-[110px] truncate text-[11px] font-bold">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar (Lifted above home gesture bar / bottom toolbar) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#121927]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 pt-2.5 pb-[calc(0.85rem+env(safe-area-inset-bottom,16px))] flex items-center justify-around text-[10px] font-medium text-slate-500 dark:text-slate-400 shadow-2xl transition-colors">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Главная</span>
        </button>

        <button
          onClick={() => handleSelectTab('questions')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-colors ${
            activeTab === 'questions' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Вопросы</span>
        </button>

        <button
          onClick={() => handleSelectTab('flashcards')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-colors ${
            activeTab === 'flashcards' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Карточки</span>
        </button>

        <button
          onClick={() => handleSelectTab('quizzes')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-colors ${
            activeTab === 'quizzes' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Тесты</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center space-y-1 p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span>Меню</span>
        </button>
      </div>

      {/* Mobile Drawer Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md animate-fadeIn pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
          <div className="bg-white dark:bg-[#121927] p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white font-mono">DevOps Pro Menu</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Toggle in Mobile Menu header too */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-[#0b1120]">
            {/* Личный кабинет quick access link */}
            <div 
              onClick={() => handleSelectTab('profile')}
              className="p-3.5 bg-white dark:bg-[#121927] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs cursor-pointer hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm">
                    {currentUser?.email ? (
                      currentUser.email[0].toUpperCase()
                    ) : currentUser?.displayName ? (
                      currentUser.displayName[0].toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  {currentUser && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#121927]"></span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'DevOps Инженер') : 'Личный кабинет'}
                    </h4>
                    {currentUser && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                        В сети
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                    {currentUser ? currentUser.email : 'Синхронизация прогресса'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTab('profile');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-600 text-[10px] font-extrabold shadow-xs transition-all cursor-pointer shrink-0"
              >
                {currentUser ? 'Профиль' : 'Войти'}
              </button>
            </div>

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
                            : 'bg-white dark:bg-[#121927] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick action theme toggle row in drawer list */}
            <div className="p-3 bg-white dark:bg-[#121927] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Цветовая тема</span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Светлая</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Темная</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
