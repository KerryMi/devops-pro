import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  X, 
  Check, 
  Terminal, 
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Users,
  ArrowLeft,
  Code2,
  Tag,
  ListPlus,
  Info,
  Database
} from 'lucide-react';
import { Question, Quiz, CategoryId, DifficultyLevel, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';

interface AdminViewProps {
  questions: Question[];
  quizzes: Quiz[];
  progress: UserProgress;
  isAdmin: boolean;
  onSetIsAdmin: (val: boolean) => void;
  onUpdateQuestions: (newQuestions: Question[]) => void;
  onUpdateQuizzes: (newQuizzes: Quiz[]) => void;
  onResetAllData: () => void;
}

type AdminSubTab = 'analytics' | 'questions' | 'quizzes' | 'settings';
type EditorMode = 'none' | 'question' | 'quiz';

export const AdminView: React.FC<AdminViewProps> = ({
  questions,
  quizzes,
  progress,
  onUpdateQuestions,
  onUpdateQuizzes,
  onResetAllData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('questions');
  const [editorMode, setEditorMode] = useState<EditorMode>('none');

  // Search & Filter States
  const [questionSearch, setQuestionSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Question Form State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionFormData, setQuestionFormData] = useState<{
    title: string;
    category: CategoryId;
    difficulty: DifficultyLevel;
    summaryAnswer: string;
    fullAnswer: string;
    tags: string[];
    newTagInput: string;
    codeLanguage: string;
    codeSnippet: string;
    interviewTips: string[];
    commonPitfalls: string[];
  }>({
    title: '',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: '',
    fullAnswer: '',
    tags: ['DevOps'],
    newTagInput: '',
    codeLanguage: 'bash',
    codeSnippet: '',
    interviewTips: [''],
    commonPitfalls: ['']
  });

  // Quiz Form State
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizFormData, setQuizFormData] = useState<Partial<Quiz>>({
    title: '',
    category: 'docker',
    difficulty: 'Middle',
    description: '',
    timeLimitMinutes: 10,
    questions: []
  });

  // Admin Audit Log
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; timestamp: string }>>([
    { id: '1', action: 'Инициализация локальной панели администратора', timestamp: new Date().toLocaleTimeString() },
    { id: '2', action: 'Открытый доступ активирован', timestamp: new Date().toLocaleTimeString() }
  ]);

  const addAuditLog = (action: string) => {
    setAuditLogs(prev => [
      { id: Date.now().toString(), action, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- QUESTION EDITOR HANDLERS ---
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      title: '',
      category: 'docker',
      difficulty: 'Middle',
      summaryAnswer: '',
      fullAnswer: '',
      tags: ['DevOps'],
      newTagInput: '',
      codeLanguage: 'bash',
      codeSnippet: '',
      interviewTips: [''],
      commonPitfalls: ['']
    });
    setEditorMode('question');
    scrollToTop();
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQuestionFormData({
      title: q.title || '',
      category: q.category || 'docker',
      difficulty: q.difficulty || 'Middle',
      summaryAnswer: q.summaryAnswer || '',
      fullAnswer: q.fullAnswer || q.summaryAnswer || '',
      tags: q.tags && q.tags.length > 0 ? q.tags : ['DevOps'],
      newTagInput: '',
      codeLanguage: q.codeSnippet?.language || 'bash',
      codeSnippet: q.codeSnippet?.code || '',
      interviewTips: q.interviewTips && q.interviewTips.length > 0 ? q.interviewTips : [''],
      commonPitfalls: q.commonPitfalls && q.commonPitfalls.length > 0 ? q.commonPitfalls : ['']
    });
    setEditorMode('question');
    scrollToTop();
  };

  const handleAddTag = () => {
    const tag = questionFormData.newTagInput.trim();
    if (tag && !questionFormData.tags.includes(tag)) {
      setQuestionFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTagInput: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setQuestionFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      const updated = questions.filter(q => q.id !== id);
      onUpdateQuestions(updated);
      addAuditLog(`Удален вопрос ID: ${id}`);
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.title.trim() || !questionFormData.summaryAnswer.trim()) {
      alert('Пожалуйста, заполните формулировку вопроса и краткий ответ!');
      return;
    }

    const cleanedTips = questionFormData.interviewTips.filter(t => t.trim() !== '');
    const cleanedPitfalls = questionFormData.commonPitfalls.filter(p => p.trim() !== '');

    if (editingQuestion) {
      const updated: Question = {
        ...editingQuestion,
        title: questionFormData.title.trim(),
        category: questionFormData.category,
        difficulty: questionFormData.difficulty,
        summaryAnswer: questionFormData.summaryAnswer.trim(),
        fullAnswer: questionFormData.fullAnswer.trim() || questionFormData.summaryAnswer.trim(),
        tags: questionFormData.tags.length > 0 ? questionFormData.tags : ['DevOps'],
        codeSnippet: questionFormData.codeSnippet.trim() ? {
          language: questionFormData.codeLanguage || 'bash',
          code: questionFormData.codeSnippet.trim()
        } : undefined,
        interviewTips: cleanedTips.length > 0 ? cleanedTips : undefined,
        commonPitfalls: cleanedPitfalls.length > 0 ? cleanedPitfalls : undefined,
      };

      const newList = questions.map(q => q.id === editingQuestion.id ? updated : q);
      onUpdateQuestions(newList);
      addAuditLog(`Обновлен вопрос: "${updated.title}"`);
    } else {
      const newQuestion: Question = {
        id: `q-custom-${Date.now()}`,
        title: questionFormData.title.trim(),
        category: questionFormData.category,
        difficulty: questionFormData.difficulty,
        summaryAnswer: questionFormData.summaryAnswer.trim(),
        fullAnswer: questionFormData.fullAnswer.trim() || questionFormData.summaryAnswer.trim(),
        tags: questionFormData.tags.length > 0 ? questionFormData.tags : ['DevOps'],
        codeSnippet: questionFormData.codeSnippet.trim() ? {
          language: questionFormData.codeLanguage || 'bash',
          code: questionFormData.codeSnippet.trim()
        } : undefined,
        interviewTips: cleanedTips.length > 0 ? cleanedTips : undefined,
        commonPitfalls: cleanedPitfalls.length > 0 ? cleanedPitfalls : undefined,
      };

      onUpdateQuestions([newQuestion, ...questions]);
      addAuditLog(`Создан новый вопрос: "${newQuestion.title}"`);
    }

    setEditorMode('none');
    scrollToTop();
  };

  // --- QUIZ EDITOR HANDLERS ---
  const handleOpenAddQuiz = () => {
    setEditingQuiz(null);
    setQuizFormData({
      title: '',
      category: 'docker',
      difficulty: 'Middle',
      description: '',
      timeLimitMinutes: 10,
      questions: [
        {
          id: `qq-1`,
          category: 'docker',
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    });
    setEditorMode('quiz');
    scrollToTop();
  };

  const handleOpenEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizFormData({ ...quiz });
    setEditorMode('quiz');
    scrollToTop();
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      const updated = quizzes.filter(q => q.id !== id);
      onUpdateQuizzes(updated);
      addAuditLog(`Удален тест ID: ${id}`);
    }
  };

  const handleAddQuizQuestion = () => {
    setQuizFormData(prev => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        {
          id: `qq-${Date.now()}`,
          category: (prev.category as CategoryId) || 'docker',
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizFormData.title?.trim()) {
      alert('Заполните название теста!');
      return;
    }

    if (!quizFormData.questions || quizFormData.questions.length === 0) {
      alert('Добавьте хотя бы один вопрос в тест!');
      return;
    }

    if (editingQuiz) {
      const updated: Quiz = {
        ...editingQuiz,
        title: quizFormData.title.trim(),
        category: (quizFormData.category as CategoryId | 'all') || editingQuiz.category,
        difficulty: (quizFormData.difficulty as DifficultyLevel | 'All') || editingQuiz.difficulty,
        description: quizFormData.description?.trim() || editingQuiz.description,
        timeLimitMinutes: quizFormData.timeLimitMinutes || 10,
        questions: quizFormData.questions
      };
      const newList = quizzes.map(q => q.id === editingQuiz.id ? updated : q);
      onUpdateQuizzes(newList);
      addAuditLog(`Обновлен тест: "${updated.title}"`);
    } else {
      const newQuiz: Quiz = {
        id: `quiz-custom-${Date.now()}`,
        title: quizFormData.title.trim(),
        category: (quizFormData.category as CategoryId | 'all') || 'docker',
        difficulty: (quizFormData.difficulty as DifficultyLevel | 'All') || 'Junior',
        description: quizFormData.description?.trim() || 'Пользовательский тест',
        timeLimitMinutes: quizFormData.timeLimitMinutes || 10,
        questions: quizFormData.questions || []
      };
      onUpdateQuizzes([newQuiz, ...quizzes]);
      addAuditLog(`Создан новый тест: "${newQuiz.title}"`);
    }

    setEditorMode('none');
    scrollToTop();
  };

  // Export Data JSON
  const handleExportData = () => {
    const dataObj = {
      exportDate: new Date().toISOString(),
      questions,
      quizzes,
      progress
    };
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devops_pro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog('Выполнен экспорт данных базы в JSON');
  };

  // Import Data JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          onUpdateQuestions(parsed.questions);
        }
        if (parsed.quizzes && Array.isArray(parsed.quizzes)) {
          onUpdateQuizzes(parsed.quizzes);
        }
        alert('Данные успешно импортированы!');
        addAuditLog('Выполнен импорт базы из файла');
      } catch (err) {
        alert('Ошибка при чтении JSON файла');
      }
    };
    reader.readAsText(file);
  };

  // Filtered Questions list
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(questionSearch.toLowerCase()) ||
                          q.summaryAnswer.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate Stats
  const totalMastered = progress.masteredQuestionIds.length;
  const totalQuizAttempts = progress.quizResults.length;
  const avgQuizScore = totalQuizAttempts > 0 
    ? Math.round(progress.quizResults.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / totalQuizAttempts) 
    : 0;

  // =========================================================================
  // RENDER 1: FULL PAGE QUESTION EDITOR (РЕDAКТОР ВОПРОСОВ)
  // =========================================================================
  if (editorMode === 'question') {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fadeIn">
        {/* HEADER BAR */}
        <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-4 z-30 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditorMode('none')}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">К списку вопросов</span>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <span>{editingQuestion ? 'Редактирование вопроса' : 'Создание нового вопроса'}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingQuestion ? `ID: ${editingQuestion.id}` : 'Заполните формулировку, развернутый ответ и примерочный код'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setEditorMode('none')}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSaveQuestion}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить вопрос</span>
            </button>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSaveQuestion} className="space-y-6">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Info className="w-4 h-4 text-emerald-500" />
              <span>1. Основные параметры</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Формулировка вопроса / Заголовок *
              </label>
              <input
                type="text"
                required
                value={questionFormData.title}
                onChange={(e) => setQuestionFormData({ ...questionFormData, title: e.target.value })}
                placeholder="Например: В чем ключевая разница между Kubernetes Ingress и LoadBalancer?"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Категория технологии
                </label>
                <select
                  value={questionFormData.category}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, category: e.target.value as CategoryId })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Уровень сложности
                </label>
                <select
                  value={questionFormData.difficulty}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, difficulty: e.target.value as DifficultyLevel })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Junior">Junior (Начальный)</option>
                  <option value="Middle">Middle (Средний)</option>
                  <option value="Senior">Senior (Продвинутый)</option>
                </select>
              </div>
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Теги и ключевые слова</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {questionFormData.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500 transition-colors p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={questionFormData.newTagInput}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, newTagInput: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Добавить тег (например: networking)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  + Тег
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: ANSWERS */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>2. Содержание ответа</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Краткая выжимка (Summary Answer) *</span>
                <span className="text-[10px] text-slate-400 font-normal">Используется в карточках и при быстром ответе</span>
              </label>
              <textarea
                required
                rows={3}
                value={questionFormData.summaryAnswer}
                onChange={(e) => setQuestionFormData({ ...questionFormData, summaryAnswer: e.target.value })}
                placeholder="Ёмкая выжимка (2-4 предложения), которую удобно быстро вспомнить на собеседовании..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Развернутый глубокий ответ (Full Answer - Markdown)</span>
                <span className="text-[10px] text-slate-400 font-normal">Поддерживает списки, жирный текст и код</span>
              </label>
              <textarea
                rows={6}
                value={questionFormData.fullAnswer}
                onChange={(e) => setQuestionFormData({ ...questionFormData, fullAnswer: e.target.value })}
                placeholder="Полное подробное объяснение концепции, архитектурных деталей, преимуществ и недостатков..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* SECTION 3: CODE SNIPPET */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>3. Пример кода / Конфигурация (опционально)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Язык / Синтаксис
                </label>
                <select
                  value={questionFormData.codeLanguage}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, codeLanguage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option value="bash">Bash / Shell</option>
                  <option value="yaml">YAML</option>
                  <option value="python">Python</option>
                  <option value="dockerfile">Dockerfile</option>
                  <option value="json">JSON</option>
                  <option value="sql">SQL</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Фрагмент кода
                </label>
                <textarea
                  rows={4}
                  value={questionFormData.codeSnippet}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, codeSnippet: e.target.value })}
                  placeholder="kubectl apply -f deployment.yaml..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: INTERVIEW TIPS & PITFALLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TIPS */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Советы для собеседования</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setQuestionFormData(prev => ({ ...prev, interviewTips: [...prev.interviewTips, ''] }))}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20"
                >
                  + Добавить
                </button>
              </div>

              <div className="space-y-2">
                {questionFormData.interviewTips.map((tip, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => {
                        const updated = [...questionFormData.interviewTips];
                        updated[idx] = e.target.value;
                        setQuestionFormData({ ...questionFormData, interviewTips: updated });
                      }}
                      placeholder={`Совет #${idx + 1}...`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = questionFormData.interviewTips.filter((_, i) => i !== idx);
                        setQuestionFormData({ ...questionFormData, interviewTips: updated });
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PITFALLS */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Частые ошибки кандидатов</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setQuestionFormData(prev => ({ ...prev, commonPitfalls: [...prev.commonPitfalls, ''] }))}
                  className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20"
                >
                  + Добавить
                </button>
              </div>

              <div className="space-y-2">
                {questionFormData.commonPitfalls.map((pitfall, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={pitfall}
                      onChange={(e) => {
                        const updated = [...questionFormData.commonPitfalls];
                        updated[idx] = e.target.value;
                        setQuestionFormData({ ...questionFormData, commonPitfalls: updated });
                      }}
                      placeholder={`Частая ошибка #${idx + 1}...`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = questionFormData.commonPitfalls.filter((_, i) => i !== idx);
                        setQuestionFormData({ ...questionFormData, commonPitfalls: updated });
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* BOTTOM ACTIONS BAR */}
          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditorMode('none')}
              className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить вопрос</span>
            </button>
          </div>

        </form>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: FULL PAGE QUIZ CONSTRUCTOR (КОНСТРУКТОР ТЕСТОВ)
  // =========================================================================
  if (editorMode === 'quiz') {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fadeIn">
        {/* HEADER BAR */}
        <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-4 z-30 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditorMode('none')}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">К списку тестов</span>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{editingQuiz ? 'Редактирование теста' : 'Конструктор нового теста'}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Создавайте варианты вопросов с единственным правильным ответом и лимитом времени
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setEditorMode('none')}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSaveQuiz}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить тест</span>
            </button>
          </div>
        </div>

        {/* QUIZ FORM CONTAINER */}
        <form onSubmit={handleSaveQuiz} className="space-y-6">
          
          {/* QUIZ SETTINGS CARD */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-emerald-500" />
              <span>Параметры и настройки теста</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Название теста *
                </label>
                <input
                  type="text"
                  required
                  value={quizFormData.title || ''}
                  onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                  placeholder="Например: Экспресс-тест: Kubernetes Ingress & Services"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Лимит времени (минуты)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={quizFormData.timeLimitMinutes || 10}
                  onChange={(e) => setQuizFormData({ ...quizFormData, timeLimitMinutes: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Категория
                </label>
                <select
                  value={quizFormData.category || 'docker'}
                  onChange={(e) => setQuizFormData({ ...quizFormData, category: e.target.value as CategoryId })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                  <option value="all">Все технологии</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Уровень сложности
                </label>
                <select
                  value={quizFormData.difficulty || 'Middle'}
                  onChange={(e) => setQuizFormData({ ...quizFormData, difficulty: e.target.value as DifficultyLevel })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                  <option value="All">Все уровни</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Описание / Цель теста
              </label>
              <textarea
                rows={2}
                value={quizFormData.description || ''}
                onChange={(e) => setQuizFormData({ ...quizFormData, description: e.target.value })}
                placeholder="Кратко опишите, какие навыки и знания проверяет данный тест..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* QUESTIONS CONSTRUCTOR SECTION */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <ListPlus className="w-4 h-4 text-emerald-500" />
                  <span>Вопросы теста ({quizFormData.questions?.length || 0})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Укажите формулировку, 4 варианта ответа и выберите радио-кнопкой правильный ответ
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuizQuestion}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/30 flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Добавить вопрос</span>
              </button>
            </div>

            {/* QUESTIONS LIST */}
            <div className="space-y-6">
              {(quizFormData.questions || []).map((q, qIndex) => (
                <div key={q.id || qIndex} className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                      Вопрос #{qIndex + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = (quizFormData.questions || []).filter((_, idx) => idx !== qIndex);
                        setQuizFormData({ ...quizFormData, questions: updated });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs border border-rose-500/20 flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Удалить вопрос</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Текст вопроса *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Введите вопрос..."
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...(quizFormData.questions || [])];
                        updated[qIndex].question = e.target.value;
                        setQuizFormData({ ...quizFormData, questions: updated });
                      }}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Варианты ответа (отметьте радио-кнопку правильного ответа):
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl border transition-colors ${
                          q.correctAnswerIndex === optIndex 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white' 
                            : 'bg-white dark:bg-[#121927] border-slate-200 dark:border-slate-800'
                        }`}>
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswerIndex === optIndex}
                            onChange={() => {
                              const updated = [...(quizFormData.questions || [])];
                              updated[qIndex].correctAnswerIndex = optIndex;
                              setQuizFormData({ ...quizFormData, questions: updated });
                            }}
                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder={`Вариант ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...(quizFormData.questions || [])];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setQuizFormData({ ...quizFormData, questions: updated });
                            }}
                            className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Пояснение к правильному ответу (показывается после ответа)
                    </label>
                    <input
                      type="text"
                      placeholder="Подробное объяснение, почему именно этот вариант правильный..."
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...(quizFormData.questions || [])];
                        updated[qIndex].explanation = e.target.value;
                        setQuizFormData({ ...quizFormData, questions: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
                    />
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddQuizQuestion}
                className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs border border-dashed border-slate-300 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Добавить еще один вопрос в тест</span>
              </button>
            </div>
          </div>

          {/* BOTTOM ACTIONS BAR */}
          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditorMode('none')}
              className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить тест</span>
            </button>
          </div>

        </form>
      </div>
    );
  }

  // =========================================================================
  // RENDER 3: MAIN ADMIN PANEL (SUB-TABS: Analytics, Questions, Quizzes, Settings)
  // =========================================================================
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-br from-emerald-50 to-slate-100 dark:from-emerald-950 dark:via-slate-900 dark:to-indigo-950 rounded-3xl p-6 sm:p-8 text-slate-800 dark:text-white shadow-2xl relative overflow-hidden border border-emerald-500/20 dark:border-emerald-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>РЕЖИМ АДМИНИСТРАТОРА</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-slate-900 dark:text-white">
              DevOps<span className="text-emerald-600 dark:text-emerald-400">Pro</span> Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Управление вопросами, создание тестов, редактирование карточек и мониторинг метрик подготовки
            </p>
          </div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('questions')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeSubTab === 'questions'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Редактор вопросов ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeSubTab === 'quizzes'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Конструктор тестов ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeSubTab === 'analytics'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Аналитика & Метрики</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeSubTab === 'settings'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Экспорт & Настройки</span>
        </button>
      </div>

      {/* --- SUB-TAB 1: QUESTIONS MANAGEMENT --- */}
      {activeSubTab === 'questions' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* TOP CONTROLS & ADD BUTTON */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Поиск по вопросам..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category selector */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-44 px-3 py-2.5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                <option value="all">Все категории</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              {/* Difficulty selector */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                <option value="all">Все сложности</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить вопрос</span>
            </button>
          </div>

          {/* QUESTIONS TABLE / LIST */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold">
                  <tr>
                    <th className="p-4">Вопрос</th>
                    <th className="p-4">Категория</th>
                    <th className="p-4">Сложн.</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 max-w-md">
                        <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{q.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{q.summaryAnswer}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[10px] uppercase">
                          {q.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.difficulty === 'Junior' ? 'bg-blue-500/10 text-blue-500' :
                          q.difficulty === 'Middle' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditQuestion(q)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            title="Открыть полноценный редактор"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Редактировать</span>
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                            title="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredQuestions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                        Вопросы не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- SUB-TAB 2: QUIZ BUILDER --- */}
      {activeSubTab === 'quizzes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Конструктор тестов</h3>
              <p className="text-xs text-slate-400">Создавайте тесты с выбором ответов в открытом полноэкранном конструкторе</p>
            </div>
            <button
              onClick={handleOpenAddQuiz}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Создать новый тест</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="p-5 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase font-bold">
                      {quiz.category} • {quiz.difficulty}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5">{quiz.title}</h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditQuiz(quiz)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-500 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Редактировать</span>
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{quiz.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{quiz.timeLimitMinutes} мин</span>
                  </span>
                  <span>{quiz.questions.length} вопросов</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: ANALYTICS --- */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-extrabold uppercase tracking-wider">Вопросов в базе</span>
                <BookOpen className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {questions.length}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">10 категорий технологий</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-extrabold uppercase tracking-wider">Тестов доступно</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {quizzes.length}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {quizzes.reduce((acc, q) => acc + q.questions.length, 0)} вопросов в тестах
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-extrabold uppercase tracking-wider">Изучено пользователем</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {totalMastered}
              </p>
              <p className="text-[10px] text-emerald-500 font-extrabold">
                {questions.length > 0 ? Math.round((totalMastered / questions.length) * 100) : 0}% от общей базы
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-extrabold uppercase tracking-wider">Пройдено тестов</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {totalQuizAttempts}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Средний балл: {avgQuizScore}%</p>
            </div>
          </div>

          {/* CATEGORY BREAKDOWN LIST */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Распределение вопросов по технологиям</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => {
                const count = questions.filter(q => q.category === cat.id).length;
                const masteredCat = questions.filter(q => q.category === cat.id && progress.masteredQuestionIds.includes(q.id)).length;
                const percent = count > 0 ? Math.round((masteredCat / count) * 100) : 0;

                return (
                  <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{cat.title}</span>
                      <span className="text-xs font-mono font-bold text-slate-500">{count} вопр.</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Освоено: {masteredCat}</span>
                      <span>{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 4: SETTINGS & BACKUP --- */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          {/* DATA STORAGE & CLOUD INFO CARD */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Как сохраняются ваши отредактированные вопросы и тесты?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-300">Полный обзор механизмов хранения и синхронизации</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-xs">
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Локальное хранение</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Все добавленные, отредактированные и удаленные вопросы и тесты <strong>автоматически сохраняются в браузере (LocalStorage)</strong> и остаются на месте даже при перезагрузке страницы.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-xs">
                <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                  <Download className="w-4 h-4" />
                  <span>2. Перенос базы (JSON)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Чтобы перенести созданные вопросы на другое устройство или поделиться ими, скачайте <strong>JSON-резервную копию</strong> и загрузите её на любом другом компьютере.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-xs">
                <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Облачный прогресс</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Прогресс изучения (изученные вопросы, закладки, результаты тестов) синхронизируется с <strong>Firebase Firestore</strong> при входе через профиль.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BACKUP & RESTORE CARD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Резервное копирование и экспорт</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Сохраните текущую базу вопросов и тестов в файл JSON или загрузите готовую резервную копию.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleExportData}
                  className="flex-1 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Экспортировать JSON</span>
                </button>

                <label className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Импортировать JSON</span>
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (window.confirm('Сбросить все кастомные изменения и вернуть исходную базу вопросов?')) {
                      onResetAllData();
                      addAuditLog('Сброс данных к исходным настройкам');
                    }
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Сбросить к исходной базе</span>
                </button>
              </div>
            </div>

            {/* AUDIT LOG CARD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span>Журнал действий администратора</span>
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-none">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-800 dark:text-slate-300 font-sans">{log.action}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
