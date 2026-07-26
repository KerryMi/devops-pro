import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, AlertTriangle, CheckCircle2, Code, ArrowRight } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { INCIDENT_SCENARIOS } from '../data/incidents';
import { QUIZZES } from '../data/quizzes';
import { CHEATSHEET_COMMANDS } from '../data/cheatsheets';
import { TabType } from './Header';
import { CategoryId } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType, filterCategory?: CategoryId) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'questions' | 'incidents' | 'quizzes' | 'cheatsheet'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const qLower = query.trim().toLowerCase();

  // Filtered Questions
  const filteredQuestions = (activeFilter === 'all' || activeFilter === 'questions') && qLower ? QUESTIONS.filter(q => 
    q.title.toLowerCase().includes(qLower) || 
    q.summaryAnswer.toLowerCase().includes(qLower) ||
    q.tags.some(t => t.toLowerCase().includes(qLower))
  ).slice(0, 5) : [];

  // Filtered Incidents
  const filteredIncidents = (activeFilter === 'all' || activeFilter === 'incidents') && qLower ? INCIDENT_SCENARIOS.filter(inc => 
    inc.title.toLowerCase().includes(qLower) || 
    inc.rootCause.toLowerCase().includes(qLower) ||
    inc.symptoms.some(s => s.toLowerCase().includes(qLower))
  ).slice(0, 5) : [];

  // Filtered Quizzes
  const filteredQuizzes = (activeFilter === 'all' || activeFilter === 'quizzes') && qLower ? QUIZZES.filter(quiz => 
    quiz.title.toLowerCase().includes(qLower) || 
    quiz.description.toLowerCase().includes(qLower)
  ).slice(0, 5) : [];

  // Filtered Cheatsheet Commands
  const filteredCommands = (activeFilter === 'all' || activeFilter === 'cheatsheet') && qLower ? CHEATSHEET_COMMANDS.filter(cmd => 
    cmd.command.toLowerCase().includes(qLower) || 
    cmd.description.toLowerCase().includes(qLower) ||
    cmd.tags.some(t => t.toLowerCase().includes(qLower))
  ).slice(0, 5) : [];

  const totalResults = filteredQuestions.length + filteredIncidents.length + filteredQuizzes.length + filteredCommands.length;

  const handleSelectResult = (tab: TabType, category?: CategoryId) => {
    onNavigate(tab, category);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121927]/50">
          <Search className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по вопросам, авариям, тестам, командам..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 mr-2 shrink-0"
              title="Очистить"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 mr-2 shrink-0">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0 flex items-center justify-center"
            title="Закрыть поиск"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'all' 
                ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setActiveFilter('questions')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center space-x-1 ${
              activeFilter === 'questions' 
                ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Вопросы</span>
          </button>
          <button
            onClick={() => setActiveFilter('incidents')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center space-x-1 ${
              activeFilter === 'incidents' 
                ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Аварии</span>
          </button>
          <button
            onClick={() => setActiveFilter('quizzes')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center space-x-1 ${
              activeFilter === 'quizzes' 
                ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Тесты</span>
          </button>
          <button
            onClick={() => setActiveFilter('cheatsheet')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center space-x-1 ${
              activeFilter === 'cheatsheet' 
                ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Шпаргалки</span>
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          {!qLower ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-500 dark:text-slate-300">Быстрый переход по тренажеру</p>
              <p>Вводите термины: <code className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">Docker</code>, <code className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">OOMKilled</code>, <code className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">Ansible</code>, <code className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">Terraform</code>, <code className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">Prometheus</code></p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              По запросу «<span className="font-semibold text-slate-300">{query}</span>» ничего не найдено.
            </div>
          ) : (
            <>
              {/* Questions */}
              {filteredQuestions.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Вопросы на собеседовании</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredQuestions.map(q => (
                      <div
                        key={q.id}
                        onClick={() => handleSelectResult('questions', q.category)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-400 transition-colors">
                            {q.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {q.summaryAnswer}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents */}
              {filteredIncidents.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Аварии в Prod</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredIncidents.map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => handleSelectResult('incidents', inc.category)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-400 transition-colors">
                            {inc.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {inc.rootCause}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes */}
              {filteredQuizzes.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Тесты и Викторины</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredQuizzes.map(quiz => (
                      <div
                        key={quiz.id}
                        onClick={() => handleSelectResult('quizzes')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-400 transition-colors">
                            {quiz.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {quiz.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cheatsheet Commands */}
              {filteredCommands.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center space-x-1">
                    <Code className="w-3.5 h-3.5" />
                    <span>Команды Шпаргалки</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredCommands.map((cmd, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectResult('cheatsheet')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 font-mono">
                          <p className="text-xs font-bold text-cyan-500 dark:text-cyan-300">
                            {cmd.command}
                          </p>
                          <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 line-clamp-1">
                            {cmd.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
