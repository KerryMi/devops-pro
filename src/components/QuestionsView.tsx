import React, { useState } from 'react';
import { Question, CategoryId, DifficultyLevel, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  Search, 
  CheckCircle2, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Lightbulb, 
  AlertCircle, 
  FileText,
  Filter,
  X
} from 'lucide-react';

interface QuestionsViewProps {
  questions: Question[];
  progress: UserProgress;
  onToggleMastered: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  initialCategory?: CategoryId;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  progress,
  onToggleMastered,
  onToggleBookmark,
  onSaveNote,
  initialCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unmastered' | 'bookmarked'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    // Search
    const matchesSearch = 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.summaryAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Category
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;

    // Difficulty
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;

    // Status
    const isMastered = progress.masteredQuestionIds.includes(q.id);
    const isBookmarked = progress.bookmarkedQuestionIds.includes(q.id);

    if (statusFilter === 'mastered' && !isMastered) return false;
    if (statusFilter === 'unmastered' && isMastered) return false;
    if (statusFilter === 'bookmarked' && !isBookmarked) return false;

    return true;
  });

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleOpenNote = (id: string) => {
    setEditingNoteId(id);
    setNoteText(progress.customNotes[id] || '');
  };

  const handleSaveNoteAction = (id: string) => {
    onSaveNote(id, noteText);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Search and Filters Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск вопросов по названию, тегам или командам (например: Kubernetes, OOM, Docker)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            
            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Уровень: Все</option>
              <option value="Junior">Junior</option>
              <option value="Middle">Middle</option>
              <option value="Senior">Senior</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Статус: Все</option>
              <option value="unmastered">Не изучено</option>
              <option value="mastered">Изучено</option>
              <option value="bookmarked">В закладках</option>
            </select>

          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Все разделы
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Найдено вопросов: <strong className="text-slate-900 dark:text-white">{filteredQuestions.length}</strong></span>
        {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || statusFilter !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setStatusFilter('all');
              setSearchTerm('');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Filter className="w-10 h-10 mx-auto text-slate-400 mb-3 opacity-50" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Ничего не найдено</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Попробуйте изменить запрос поиска или сбросить фильтры.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isMastered = progress.masteredQuestionIds.includes(q.id);
            const isBookmarked = progress.bookmarkedQuestionIds.includes(q.id);
            const userNote = progress.customNotes[q.id];

            return (
              <div
                key={q.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 border transition-all overflow-hidden shadow-sm ${
                  isExpanded
                    ? 'border-indigo-500/50 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                
                {/* Header Item */}
                <div className="p-5 flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : q.id)}>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Difficulty Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        q.difficulty === 'Junior'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : q.difficulty === 'Middle'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {q.difficulty}
                      </span>

                      {/* Category Label */}
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {CATEGORIES.find(c => c.id === q.category)?.title}
                      </span>

                      {/* User Note indicator */}
                      {userNote && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-medium flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>Заметка</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {q.title}
                    </h3>

                    {!isExpanded && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {q.summaryAnswer}
                      </p>
                    )}
                  </div>

                  {/* Actions & Chevron */}
                  <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                      }`}
                      title="В закладки"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    {/* Mastered Toggle */}
                    <button
                      onClick={() => onToggleMastered(q.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
                        isMastered
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMastered ? 'Изучено' : 'Выучить'}</span>
                    </button>

                    {/* Expand Toggle */}
                    <button 
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                  </div>

                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
                    
                    {/* Summary Answer Box */}
                    <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                        Краткий ответ за 30 секунд:
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {q.summaryAnswer}
                      </p>
                    </div>

                    {/* Full Answer Body */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Подробный разбор:
                      </h4>
                      <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                        {q.fullAnswer}
                      </div>
                    </div>

                    {/* Code Snippet if present */}
                    {q.codeSnippet && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400 uppercase">
                            {q.codeSnippet.language}
                          </span>
                          <button
                            onClick={() => handleCopyCode(q.codeSnippet!.code, q.id)}
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] transition-colors"
                          >
                            {copiedCodeId === q.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Скопировано</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Копировать</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800 leading-normal">
                          <code>{q.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Interview Tips */}
                    {q.interviewTips && q.interviewTips.length > 0 && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 space-y-2">
                        <div className="flex items-center space-x-2 font-bold text-xs">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span>Совет: как преподносить ответ на собеседовании:</span>
                        </div>
                        <ul className="list-disc list-inside text-xs space-y-1 text-slate-700 dark:text-amber-200/90 leading-relaxed">
                          {q.interviewTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Common Pitfalls */}
                    {q.commonPitfalls && q.commonPitfalls.length > 0 && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-300 space-y-2">
                        <div className="flex items-center space-x-2 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                          <span>Частые ошибки кандидатов:</span>
                        </div>
                        <ul className="list-disc list-inside text-xs space-y-1 text-slate-700 dark:text-rose-200/90 leading-relaxed">
                          {q.commonPitfalls.map((pitfall, idx) => (
                            <li key={idx}>{pitfall}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Personal Notes Section */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      {editingNoteId === q.id ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ваша личная заметка к вопросу:</label>
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            rows={3}
                            placeholder="Запишите свои формулировки или примеры из вашего опыта..."
                            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                            >
                              Отмена
                            </button>
                            <button
                              onClick={() => handleSaveNoteAction(q.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                            >
                              Сохранить заметку
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {userNote ? (
                              <span className="text-slate-700 dark:text-slate-300 italic">"{userNote}"</span>
                            ) : (
                              <span className="text-slate-400">Заметок пока нет.</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenNote(q.id)}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {userNote ? 'Изменить заметку' : '+ Добавить заметку'}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
