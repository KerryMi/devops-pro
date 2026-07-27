import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
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
  HelpCircle,
  Clock,
  Sparkles,
  Lock,
  Layers,
  FileCode,
  Users,
  Eye,
  EyeOff,
  KeyRound,
  Database
} from 'lucide-react';
import { Question, Quiz, QuizQuestion, CategoryId, DifficultyLevel, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { verifyAdminPassword, setAdminPassword } from '../utils/customDataStorage';

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

type AdminSubTab = 'analytics' | 'questions' | 'quizzes' | 'flashcards' | 'settings';

export const AdminView: React.FC<AdminViewProps> = ({
  questions,
  quizzes,
  progress,
  isAdmin,
  onSetIsAdmin,
  onUpdateQuestions,
  onUpdateQuizzes,
  onResetAllData
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Change Password States
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passChangeMessage, setPassChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('analytics');

  // Search & Filter States
  const [questionSearch, setQuestionSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Modal / Form States for Questions
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionFormData, setQuestionFormData] = useState<Partial<Question>>({
    title: '',
    category: 'docker',
    difficulty: 'Middle',
    summaryAnswer: '',
    fullAnswer: '',
    tags: ['DevOps'],
    codeSnippet: { language: 'bash', code: '', description: '' },
    interviewTips: [''],
    commonPitfalls: ['']
  });

  // Modal / Form States for Quizzes
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
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
    { id: '1', action: 'Вход в панель администратора', timestamp: new Date().toLocaleTimeString() },
    { id: '2', action: 'Загрузка системы управления вопросами', timestamp: new Date().toLocaleTimeString() }
  ]);

  const addAuditLog = (action: string) => {
    setAuditLogs(prev => [
      { id: Date.now().toString(), action, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Login handler
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (verifyAdminPassword(pinInput)) {
      onSetIsAdmin(true);
      setPinError('');
      setPinInput('');
      addAuditLog('Успешная авторизация администратора');
    } else {
      setPinError('Неверный пароль администратора. Доступ запрещен.');
    }
  };

  // Change Admin Password handler
  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeMessage(null);

    if (!verifyAdminPassword(currentPassInput)) {
      setPassChangeMessage({ text: 'Текущий пароль введен неверно!', isError: true });
      return;
    }

    if (!newPassInput || newPassInput.trim().length < 4) {
      setPassChangeMessage({ text: 'Новый пароль должен содержать минимум 4 символа', isError: true });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassChangeMessage({ text: 'Новый пароль и подтверждение не совпадают', isError: true });
      return;
    }

    setAdminPassword(newPassInput.trim());
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setPassChangeMessage({ text: 'Пароль успешно обновлен!', isError: false });
    addAuditLog('Смена пароля администратора');
  };

  // --- QUESTION HANDLERS ---
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      title: '',
      category: 'docker',
      difficulty: 'Middle',
      summaryAnswer: '',
      fullAnswer: '',
      tags: ['DevOps'],
      codeSnippet: { language: 'bash', code: '', description: '' },
      interviewTips: [''],
      commonPitfalls: ['']
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQuestionFormData({
      ...q,
      codeSnippet: q.codeSnippet || { language: 'bash', code: '', description: '' },
      interviewTips: q.interviewTips && q.interviewTips.length > 0 ? q.interviewTips : [''],
      commonPitfalls: q.commonPitfalls && q.commonPitfalls.length > 0 ? q.commonPitfalls : ['']
    });
    setIsQuestionModalOpen(true);
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
    if (!questionFormData.title || !questionFormData.summaryAnswer) {
      alert('Заполните заголовок и краткий ответ');
      return;
    }

    const cleanedTips = (questionFormData.interviewTips || []).filter(t => t.trim() !== '');
    const cleanedPitfalls = (questionFormData.commonPitfalls || []).filter(p => p.trim() !== '');

    if (editingQuestion) {
      // Update
      const updated: Question = {
        ...editingQuestion,
        title: questionFormData.title || editingQuestion.title,
        category: (questionFormData.category as CategoryId) || editingQuestion.category,
        difficulty: (questionFormData.difficulty as DifficultyLevel) || editingQuestion.difficulty,
        summaryAnswer: questionFormData.summaryAnswer || editingQuestion.summaryAnswer,
        fullAnswer: questionFormData.fullAnswer || editingQuestion.summaryAnswer,
        tags: questionFormData.tags || editingQuestion.tags,
        codeSnippet: questionFormData.codeSnippet?.code ? questionFormData.codeSnippet : undefined,
        interviewTips: cleanedTips.length > 0 ? cleanedTips : undefined,
        commonPitfalls: cleanedPitfalls.length > 0 ? cleanedPitfalls : undefined,
      };

      const newList = questions.map(q => q.id === editingQuestion.id ? updated : q);
      onUpdateQuestions(newList);
      addAuditLog(`Обновлен вопрос: "${updated.title}"`);
    } else {
      // Create new
      const newQuestion: Question = {
        id: `q-custom-${Date.now()}`,
        title: questionFormData.title!,
        category: (questionFormData.category as CategoryId) || 'docker',
        difficulty: (questionFormData.difficulty as DifficultyLevel) || 'Junior',
        summaryAnswer: questionFormData.summaryAnswer!,
        fullAnswer: questionFormData.fullAnswer || questionFormData.summaryAnswer!,
        tags: questionFormData.tags || ['Custom'],
        codeSnippet: questionFormData.codeSnippet?.code ? questionFormData.codeSnippet : undefined,
        interviewTips: cleanedTips.length > 0 ? cleanedTips : undefined,
        commonPitfalls: cleanedPitfalls.length > 0 ? cleanedPitfalls : undefined,
      };

      onUpdateQuestions([newQuestion, ...questions]);
      addAuditLog(`Создан новый вопрос: "${newQuestion.title}"`);
    }

    setIsQuestionModalOpen(false);
  };

  // --- QUIZ HANDLERS ---
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
    setIsQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizFormData({ ...quiz });
    setIsQuizModalOpen(true);
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      const updated = quizzes.filter(q => q.id !== id);
      onUpdateQuizzes(updated);
      addAuditLog(`Удален тест ID: ${id}`);
    }
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizFormData.title) {
      alert('Заполните название теста');
      return;
    }

    if (editingQuiz) {
      const updated: Quiz = {
        ...editingQuiz,
        title: quizFormData.title || editingQuiz.title,
        category: (quizFormData.category as CategoryId | 'all') || editingQuiz.category,
        difficulty: (quizFormData.difficulty as DifficultyLevel | 'All') || editingQuiz.difficulty,
        description: quizFormData.description || editingQuiz.description,
        timeLimitMinutes: quizFormData.timeLimitMinutes || 10,
        questions: quizFormData.questions || editingQuiz.questions
      };
      const newList = quizzes.map(q => q.id === editingQuiz.id ? updated : q);
      onUpdateQuizzes(newList);
      addAuditLog(`Обновлен тест: "${updated.title}"`);
    } else {
      const newQuiz: Quiz = {
        id: `quiz-custom-${Date.now()}`,
        title: quizFormData.title!,
        category: (quizFormData.category as CategoryId | 'all') || 'docker',
        difficulty: (quizFormData.difficulty as DifficultyLevel | 'All') || 'Junior',
        description: quizFormData.description || 'Пользовательский тест',
        timeLimitMinutes: quizFormData.timeLimitMinutes || 10,
        questions: quizFormData.questions || []
      };
      onUpdateQuizzes([newQuiz, ...quizzes]);
      addAuditLog(`Создан новый тест: "${newQuiz.title}"`);
    }

    setIsQuizModalOpen(false);
  };

  // Add question row in quiz modal
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

  // Render Auth Gate if not admin
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Панель Администратора
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Вход для управления вопросами, тестами и просмотра аналитики
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Пароль администратора</span>
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Введите секретный пароль..."
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {pinError && (
              <p className="text-xs text-rose-500 font-medium flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Войти в админ-панель</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">
              🔒 Доступ защищен локальным мастер-паролем. Сменить пароль можно в настройках панели.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>РЕЖИМ АДМИНИСТРАТОРА</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
              DevOps<span className="text-emerald-400">Pro</span> Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Управление вопросами, создание тестов, редактирование карточек и мониторинг метрик подготовки
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onSetIsAdmin(false);
                addAuditLog('Выход из режима администратора');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Выйти из админки</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
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
          onClick={() => setActiveSubTab('questions')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeSubTab === 'questions'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Вопросы ({questions.length})</span>
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
          <span>Конструктор Тестов ({quizzes.length})</span>
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
          <span>Настройки & Экспорт</span>
        </button>
      </div>

      {/* --- SUB-TAB 1: ANALYTICS --- */}
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

      {/* --- SUB-TAB 2: QUESTIONS MANAGEMENT --- */}
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
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                            title="Редактировать"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
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

      {/* --- SUB-TAB 3: QUIZ BUILDER --- */}
      {activeSubTab === 'quizzes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Конструктор тестов</h3>
              <p className="text-xs text-slate-400">Создавайте ручные тесты с выбором ответов</p>
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
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/20 text-slate-500 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 transition-colors"
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

      {/* --- SUB-TAB 4: SETTINGS & BACKUP --- */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          {/* DATA STORAGE & CLOUD INFO CARD */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">Как сохраняются ваши отредактированные вопросы и тесты?</h3>
                <p className="text-xs text-slate-300">Полный обзор механизмов хранения и синхронизации</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-black text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Локальное хранение</span>
                </div>
                <p className="text-xs text-slate-300">
                  Все добавленные, отредактированные и удаленные вопросы и тесты <strong>автоматически сохраняются в браузере (LocalStorage)</strong> и остаются на месте даже при перезагрузке страницы или закрытии браузера.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-black text-indigo-400 flex items-center space-x-1.5">
                  <Download className="w-4 h-4" />
                  <span>2. Перенос базы (JSON)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Чтобы перенести созданные вопросы на другое устройство или поделиться ими, скачайте <strong>JSON-резервную копию</strong> и загрузите её на любом другом компьютере.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-black text-amber-400 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Облачный прогресс</span>
                </div>
                <p className="text-xs text-slate-300">
                  Прогресс изучения (изученные вопросы, закладки, результаты тестов) синхронизируется с <strong>Firebase Firestore</strong> при входе через Google/Email в профиле.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SECURITY & CHANGE PASSWORD CARD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-emerald-500" />
                <span>Безопасность панели (Смена пароля)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Задайте собственный секретный пароль для закрытого входа в админ-панель.
              </p>

              <form onSubmit={handleChangeAdminPassword} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    placeholder="Текущий пароль"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Новый пароль
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      placeholder="Новый пароль"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Подтверждение
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Повторите пароль"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {passChangeMessage && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                    passChangeMessage.isError 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {passChangeMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                    <span>{passChangeMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Сохранить новый пароль</span>
                </button>
              </form>
            </div>

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

      {/* --- QUESTION ADD/EDIT MODAL --- */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingQuestion ? 'Редактировать вопрос' : 'Новый вопрос'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Заголовок / Формулировка вопроса *
                </label>
                <input
                  type="text"
                  required
                  value={questionFormData.title || ''}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, title: e.target.value })}
                  placeholder="Например: В чем разница между Docker exec и Docker run?"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Категория</label>
                  <select
                    value={questionFormData.category || 'docker'}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, category: e.target.value as CategoryId })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Сложность</label>
                  <select
                    value={questionFormData.difficulty || 'Middle'}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Краткий ответ (Summary Answer) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionFormData.summaryAnswer || ''}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, summaryAnswer: e.target.value })}
                  placeholder="Ёмкая выжимка для быстрых карточек и ответа рекрутеру..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Развернутый ответ (Full Answer - Markdown)
                </label>
                <textarea
                  rows={5}
                  value={questionFormData.fullAnswer || ''}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, fullAnswer: e.target.value })}
                  placeholder="Подробный ответ с техническими деталями..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Пример кода (опционально)</label>
                <textarea
                  rows={3}
                  value={questionFormData.codeSnippet?.code || ''}
                  onChange={(e) => setQuestionFormData({
                    ...questionFormData,
                    codeSnippet: { language: 'bash', code: e.target.value }
                  })}
                  placeholder="docker run -d -p 80:80 nginx"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold text-xs cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- QUIZ ADD/EDIT MODAL --- */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingQuiz ? 'Редактировать тест' : 'Новый тест'}
              </h3>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Название теста *</label>
                  <input
                    type="text"
                    required
                    value={quizFormData.title || ''}
                    onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                    placeholder="Например: Экспресс-тест: Kubernetes Ingress"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Лимит времени (минуты)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={quizFormData.timeLimitMinutes || 10}
                    onChange={(e) => setQuizFormData({ ...quizFormData, timeLimitMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Описание теста</label>
                <textarea
                  rows={2}
                  value={quizFormData.description || ''}
                  onChange={(e) => setQuizFormData({ ...quizFormData, description: e.target.value })}
                  placeholder="О чем этот тест..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
              </div>

              {/* QUESTIONS IN QUIZ */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Вопросы теста ({quizFormData.questions?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuizQuestion}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Добавить вопрос</span>
                  </button>
                </div>

                {(quizFormData.questions || []).map((q, qIndex) => (
                  <div key={q.id || qIndex} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-500">Вопрос #{qIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (quizFormData.questions || []).filter((_, idx) => idx !== qIndex);
                          setQuizFormData({ ...quizFormData, questions: updated });
                        }}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Текст вопроса..."
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...(quizFormData.questions || [])];
                        updated[qIndex].question = e.target.value;
                        setQuizFormData({ ...quizFormData, questions: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswerIndex === optIndex}
                            onChange={() => {
                              const updated = [...(quizFormData.questions || [])];
                              updated[qIndex].correctAnswerIndex = optIndex;
                              setQuizFormData({ ...quizFormData, questions: updated });
                            }}
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-xs"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Пояснение к правильному ответу..."
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...(quizFormData.questions || [])];
                        updated[qIndex].explanation = e.target.value;
                        setQuizFormData({ ...quizFormData, questions: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold text-xs cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить тест</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
