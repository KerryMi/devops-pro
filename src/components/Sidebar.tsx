import React from 'react';
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
  Search,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { TabType } from './Header';
import { CategoryId } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface SidebarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType, cat?: CategoryId) => void;
  masteredCount: number;
  totalQuestionsCount: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSearch: () => void;
  currentUser: FirebaseUser | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  masteredCount,
  totalQuestionsCount,
  unlockedAchievementsCount,
  totalAchievementsCount,
  isDarkMode,
  setIsDarkMode,
  onOpenSearch,
  currentUser
}) => {
  const navGroups = [
    {
      groupName: 'ГЛАВНАЯ',
      items: [
        { id: 'dashboard' as TabType, label: 'Главная', icon: <Layers className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'ОБУЧЕНИЕ & БАЗА',
      items: [
        { id: 'questions' as TabType, label: 'Вопросы', icon: <BookOpen className="w-4 h-4" />, badge: `${masteredCount}/${totalQuestionsCount}` },
        { id: 'flashcards' as TabType, label: 'Карточки', icon: <Bookmark className="w-4 h-4" /> },
        { id: 'quizzes' as TabType, label: 'Тесты', icon: <CheckCircle2 className="w-4 h-4" /> },
        { id: 'cheatsheet' as TabType, label: 'Шпаргалки', icon: <Code className="w-4 h-4" /> }
      ]
    },
    {
      groupName: 'ПРАКТИКА & СИМУЛЯЦИЯ',
      items: [
        { id: 'incidents' as TabType, label: 'Аварии в Prod', icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, badge: 'New' }
      ]
    },
    {
      groupName: 'КАРЬЕРА & РЕЗЮМЕ',
      items: [
        { id: 'achievements' as TabType, label: 'Достижения', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: `${unlockedAchievementsCount}/${totalAchievementsCount}` },
        { id: 'legend' as TabType, label: 'Легенда опыта', icon: <Award className="w-4 h-4" /> },
        { id: 'resume' as TabType, label: 'Резюме', icon: <FileText className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex fixed top-0 bottom-0 left-0 w-64 z-30 flex-col bg-white dark:bg-[#121927] border-r border-slate-200 dark:border-slate-800/80 transition-colors">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-mono">DevOps<span className="text-emerald-500">Pro</span></span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bento DevOps Hub</p>
          </div>
        </div>
      </div>

      {/* Search Input in Sidebar */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs transition-all shadow-inner group hover:border-emerald-500/40"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="truncate">Поиск по сайту...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-none">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {group.groupName}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/30 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 dark:bg-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                      }`}>
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

      {/* User Profile Card in Sidebar */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-[#0b1120]/10 shrink-0">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-white dark:bg-[#121927] border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser ? (currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />) : <User className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate leading-none">
              {currentUser ? currentUser.displayName || 'DevOps Инженер' : 'Личный кабинет'}
            </span>
            <span className="block text-[10px] text-slate-400 truncate mt-1 leading-none">
              {currentUser ? currentUser.email : 'Синхронизация'}
            </span>
          </div>
        </button>
      </div>

      {/* Footer Info & Theme Toggle in Sidebar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 bg-slate-50/50 dark:bg-[#0b1120]/30">
        <span className="text-[11px] font-mono">DevOpsPro v2.5</span>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs transition-colors"
          title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

    </aside>
  );
};
