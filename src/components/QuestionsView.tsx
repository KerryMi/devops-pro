import React, { useState, useEffect, useRef } from 'react';
import { Question, CategoryId, DifficultyLevel, UserProgress } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Search, 
  CheckCircle2, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Lightbulb, 
  FileText,
  X,
  TrendingUp,
  Terminal,
  Box,
  Settings,
  Layers,
  GitBranch,
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe
} from 'lucide-react';

interface QuestionsViewProps {
  questions: Question[];
  progress: UserProgress;
  onToggleMastered: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  initialCategory?: CategoryId;
}

const STAGES = [
  {
    id: 1,
    title: 'Linux & System Internals',
    subtitle: 'Базовая операционная система',
    description: 'Изучение управления процессами, системных вызовов, памяти, дисков, systemd и основ работы ОС Linux.',
    categoryIds: ['linux'] as CategoryId[],
    iconName: 'Terminal',
  },
  {
    id: 2,
    title: 'Сети & Безопасность',
    subtitle: 'Сетевой стек и протоколы',
    description: 'Разбор модели OSI, стека TCP/IP, DNS, TLS/SSL, HTTPS, маршрутизации и сетевых утилит.',
    categoryIds: ['networking'] as CategoryId[],
    iconName: 'Globe',
  },
  {
    id: 3,
    title: 'Docker & Контейнеризация',
    subtitle: 'Изоляция и рантайм контейнеров',
    description: 'Понимание namespaces, cgroups, оптимизации слоев образов, мультистейдж сборки и сетевой структуры Docker.',
    categoryIds: ['docker'] as CategoryId[],
    iconName: 'Box',
  },
  {
    id: 4,
    title: 'Ansible & IaC (Автоматизация)',
    subtitle: 'Инфраструктура как код и конфигурация',
    description: 'Управление конфигурациями с помощью Ansible playbooks, ролей и идемпотентности, а также декларативное описание ресурсов в Terraform.',
    categoryIds: ['ansible', 'terraform'] as CategoryId[],
    iconName: 'Settings',
  },
  {
    id: 5,
    title: 'Kubernetes & Оркестрация',
    subtitle: 'Масштабирование и деплой в k8s',
    description: 'Архитектура Control Plane, жизненный цикл Pod, манифесты Deployment, StatefulSet, сетевое взаимодействие CNI, Ingress и сервис-меш.',
    categoryIds: ['k8s'] as CategoryId[],
    iconName: 'Layers',
  },
  {
    id: 6,
    title: 'CI/CD & GitOps',
    subtitle: 'Непрерывная интеграция и доставка',
    description: 'Построение пайплайнов девелопмента в GitLab CI и GitHub Actions, автоматизация деплоя через ArgoCD и шаблонизация Helm.',
    categoryIds: ['cicd'] as CategoryId[],
    iconName: 'GitBranch',
  },
  {
    id: 7,
    title: 'Мониторинг & Observability',
    subtitle: 'Наблюдаемость и архитектура',
    description: 'Сбор метрик в Prometheus, визуализация в Grafana, распределенная трассировка, логирование и высокоуровневый System Design.',
    categoryIds: ['monitoring', 'cloud', 'sysdesign'] as CategoryId[],
    iconName: 'Activity',
  },
];

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  progress,
  onToggleMastered,
  onToggleBookmark,
  onSaveNote,
  initialCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unmastered' | 'bookmarked'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  // Active filter for single-stage vs all-stages view
  const [selectedStageFilter, setSelectedStageFilter] = useState<number | 'all'>('all');

  // Track which stage accordions are expanded
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  });

  // Expand matching stage if initialCategory is passed
  useEffect(() => {
    if (initialCategory) {
      const matchingStage = STAGES.find(s => s.categoryIds.includes(initialCategory));
      if (matchingStage) {
        setSelectedStageFilter(matchingStage.id);
        setExpandedStages(prev => ({ ...prev, [matchingStage.id]: true }));
        setTimeout(() => {
          const element = document.getElementById(`stage-panel-${matchingStage.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, [initialCategory, questions]);

  // Scroll to top when selecting a question to read
  useEffect(() => {
    if (selectedQuestion) {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedQuestion]);

  const toggleStageExpand = (stageId: number) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const handleStageClick = (stageId: number) => {
    setSelectedStageFilter(stageId);
    setExpandedStages(prev => ({ ...prev, [stageId]: true }));
    setTimeout(() => {
      const element = document.getElementById(`stage-panel-${stageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Base filtering of questions within a stage
  const getFilteredQuestionsForStage = (stageQuestionList: Question[]) => {
    const filtered = stageQuestionList.filter((q) => {
      const matchesSearch = 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.summaryAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;

      const isMastered = progress.masteredQuestionIds.includes(q.id);
      const isBookmarked = progress.bookmarkedQuestionIds.includes(q.id);

      if (statusFilter === 'mastered' && !isMastered) return false;
      if (statusFilter === 'unmastered' && isMastered) return false;
      if (statusFilter === 'bookmarked' && !isBookmarked) return false;

      return true;
    });

    const difficultyOrder: Record<DifficultyLevel, number> = {
      'Junior': 1,
      'Middle': 2,
      'Senior': 3
    };

    return [...filtered].sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
    });
  };

  // Get ALL filtered questions across all visible stages (for slider navigation in detailed view)
  const getAllFilteredQuestions = () => {
    let list = questions;
    if (selectedStageFilter !== 'all') {
      const stage = STAGES.find(s => s.id === selectedStageFilter);
      if (stage) {
        list = questions.filter(q => stage.categoryIds.includes(q.category));
      }
    }
    return getFilteredQuestionsForStage(list);
  };

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

  const getCodeString = (snippet: any): string => {
    if (!snippet) return '';
    if (typeof snippet === 'string') return snippet;
    if (typeof snippet === 'object' && snippet.code) return snippet.code;
    return '';
  };

  // Overall statistics
  const totalMasteredCount = questions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
  const overallPercentage = questions.length > 0 ? Math.round((totalMasteredCount / questions.length) * 100) : 0;

  // Find navigation neighbors in detail view
  const filteredList = getAllFilteredQuestions();
  const currentIndex = selectedQuestion ? filteredList.findIndex(q => q.id === selectedQuestion.id) : -1;
  const prevQuestion = currentIndex > 0 ? filteredList[currentIndex - 1] : null;
  const nextQuestion = currentIndex < filteredList.length - 1 ? filteredList[currentIndex + 1] : null;

  const renderStageIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case 'Terminal': return <Terminal className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Box': return <Box className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'GitBranch': return <GitBranch className={className} />;
      case 'Activity': return <Activity className={className} />;
      default: return <FileText className={className} />;
    }
  };

  return (
    <div ref={topRef} className="space-y-6 pb-20 relative min-h-[600px]">
      
      <AnimatePresence mode="wait">
        {!selectedQuestion ? (
          /* ========================================================================= */
          /* ======================== 1. MAIN QUESTIONS LIST VIEW ==================== */
          /* ========================================================================= */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* ================= HEADER BENTO DASHBOARD ================= */}
            <div className="grid grid-cols-12 gap-5">
              
              {/* Interactive Map Bento Card (replacing Main Info Bento Card) */}
              <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#111520] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-5 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/40">
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span>Интерактивная карта подготовки</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Учебный трек системного инженера. Выберите шаг для фильтрации.
                    </p>
                  </div>

                  {/* Right side controls: overall progress & show-all toggle */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {selectedStageFilter !== 'all' && (
                      <button
                        onClick={() => setSelectedStageFilter('all')}
                        className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 shadow-xs cursor-pointer"
                      >
                        <span>Показать все</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Готовность:</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{overallPercentage}%</span>
                      <div className="w-14 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                        <div 
                          className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          style={{ width: `${overallPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subway Line Map with dynamic connector lines */}
                <div className="relative py-1">
                  {/* Background static line */}
                  <div className="absolute top-[28px] left-10 right-10 h-[3px] bg-slate-100 dark:bg-slate-900/80 -z-10 hidden md:block" />

                  {/* Active progressive connection line overlay */}
                  <div className="absolute top-[28px] left-10 right-10 h-[3px] -z-10 hidden md:block pointer-events-none">
                    <div className="flex justify-between w-full h-full">
                      {STAGES.map((st, idx) => {
                        if (idx === STAGES.length - 1) return null;
                        const stageQuestions = questions.filter(q => st.categoryIds.includes(q.category));
                        const totalInStage = stageQuestions.length;
                        const masteredInStage = stageQuestions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
                        const isCompleted = totalInStage > 0 && masteredInStage === totalInStage;
                        return (
                          <div 
                            key={`line-active-${st.id}`}
                            className={`flex-1 h-full transition-all duration-500 ${
                              isCompleted ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-transparent'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Flex horizontal buttons */}
                  <div className="relative flex items-stretch justify-between gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
                    {STAGES.map((st) => {
                      const stageQuestions = questions.filter(q => st.categoryIds.includes(q.category));
                      const totalInStage = stageQuestions.length;
                      const masteredInStage = stageQuestions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
                      const isCompleted = totalInStage > 0 && masteredInStage === totalInStage;
                      const isCurrentlySelected = selectedStageFilter === st.id;
                      const stagePercent = totalInStage > 0 ? Math.round((masteredInStage / totalInStage) * 100) : 0;

                      let nodeOuterStyle = '';
                      let nodeInnerStyle = '';
                      let labelColor = 'text-slate-500 dark:text-slate-400';

                      if (isCurrentlySelected) {
                        nodeOuterStyle = 'ring-4 ring-emerald-500/15 border-emerald-500 dark:border-emerald-400 bg-white dark:bg-[#161b26] scale-[1.03]';
                        nodeInnerStyle = 'text-emerald-500 dark:text-emerald-400';
                        labelColor = 'text-slate-900 dark:text-white font-black';
                      } else if (isCompleted) {
                        nodeOuterStyle = 'border-emerald-500/80 bg-emerald-500/10 dark:bg-emerald-500/5 hover:border-emerald-500';
                        nodeInnerStyle = 'text-emerald-500 dark:text-emerald-400';
                        labelColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
                      } else {
                        nodeOuterStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#121620]/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-[#121620]/80';
                        nodeInnerStyle = 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300';
                        labelColor = 'text-slate-600 dark:text-slate-400';
                      }

                      return (
                        <button
                          key={st.id}
                          onClick={() => handleStageClick(st.id)}
                          className={`flex-1 min-w-[130px] md:min-w-0 flex flex-col items-center text-center space-y-2 snap-start group relative cursor-pointer p-2 rounded-2xl transition-all duration-300 ${
                            isCurrentlySelected ? 'bg-slate-50/40 dark:bg-[#0c0f16]/20' : ''
                          }`}
                        >
                          {/* Circle Icon Badge Node */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative ${nodeOuterStyle}`}>
                            <div className={`transition-transform duration-300 group-hover:scale-110 ${nodeInnerStyle}`}>
                              {renderStageIcon(st.iconName, "w-6 h-6 stroke-[2]")}
                            </div>

                            {/* Sequential Step/Done indicator */}
                            <div className={`absolute -bottom-1 -right-1.5 w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors ${
                              isCompleted 
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                                : isCurrentlySelected
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}>
                              {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : st.id}
                            </div>
                          </div>

                          <div className="space-y-1 w-full">
                            <span className={`text-[10px] font-bold tracking-tight block truncate ${labelColor}`}>
                              {st.title.split(' & ')[0]}
                            </span>
                            
                            {/* Detailed micro progress slider */}
                            <div className="space-y-0.5 pt-0.5 px-0.5">
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                <span>{masteredInStage}/{totalInStage}</span>
                                <span>{stagePercent}%</span>
                              </div>
                              <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden relative border border-slate-200/20 dark:border-slate-800/20">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                  style={{ width: `${stagePercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Dynamic Details Card */}
                <div className="bg-slate-50/50 dark:bg-[#0c0f16]/30 border border-slate-100 dark:border-slate-800/40 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 min-h-[84px]">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {selectedStageFilter === 'all' ? 'Полный обзор' : `Этап ${selectedStageFilter}`}
                      </span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {selectedStageFilter === 'all' 
                          ? "Учебный трек подготовки по системной инженерии" 
                          : STAGES.find(s => s.id === selectedStageFilter)?.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {selectedStageFilter === 'all' 
                        ? "Изучайте ключевые концепции от базового администрирования операционных систем Linux до сложнейших распределенных сетей, Docker, Ansible, оркестрации Kubernetes, конвейеров CI/CD и системного дизайна."
                        : STAGES.find(s => s.id === selectedStageFilter)?.description}
                    </p>
                  </div>

                  {selectedStageFilter !== 'all' && (
                    <div className="shrink-0">
                      <button
                        onClick={() => handleStageClick(selectedStageFilter as number)}
                        className="text-[11px] font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-3.5 py-2 rounded-xl shadow-xs hover:shadow-emerald-500/20 transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Смотреть вопросы</span>
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Statistics Bento Card */}
              <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#161a23] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-slate-900 dark:text-white flex flex-col justify-between shadow-sm dark:shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="space-y-3 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>Статистика прогресса</span>
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{totalMasteredCount}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ {questions.length} пройдено</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">В закладках:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                      <Bookmark className="w-3 h-3 fill-current" />
                      <span>{progress.bookmarkedQuestionIds.length}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Заметок сохранено:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{Object.keys(progress.customNotes).length}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* ================= 3. STICKY FILTER & SEARCH HUB ================= */}
            <div className="sticky top-14 sm:top-16 z-30 bg-white/95 dark:bg-[#0c0f16]/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md space-y-3 transition-colors duration-200">
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                
                {/* Search Bar Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Искать по ключевым терминам (OOM, Namespace, Helm, cgroups, Systemd)..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Styled Filter Controls */}
                <div className="flex items-center space-x-2 shrink-0">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="all">Сложность: Все</option>
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="all">Статус: Все</option>
                    <option value="unmastered">Не изучено</option>
                    <option value="mastered">Изучено</option>
                    <option value="bookmarked">В закладках</option>
                  </select>
                </div>
              </div>

              {/* Quick filter stages selector pills row */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 scrollbar-none">
                <button
                  onClick={() => setSelectedStageFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    selectedStageFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#121620] dark:hover:bg-[#1a202e] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>Все этапы</span>
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded ${
                    selectedStageFilter === 'all' ? 'bg-slate-950/15' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {questions.length}
                  </span>
                </button>
                
                {STAGES.map((st) => {
                  const isSel = selectedStageFilter === st.id;
                  const stageQuestions = questions.filter(q => st.categoryIds.includes(q.category));
                  const masteredInStage = stageQuestions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
                  const totalInStage = stageQuestions.length;
                  
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedStageFilter(st.id);
                        setExpandedStages(prev => ({ ...prev, [st.id]: true }));
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isSel
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#121620] dark:hover:bg-[#1a202e] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Шаг {st.id}: {st.title.split(' & ')[0]}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded ${
                        isSel ? 'bg-slate-950/15' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {masteredInStage}/{totalInStage}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* ================= 4. QUESTIONS CONTAINER (BENTO GRID) ================= */}
            <div className="space-y-6">
              {STAGES.map((st) => {
                if (selectedStageFilter !== 'all' && selectedStageFilter !== st.id) {
                  return null;
                }

                const stageQuestions = questions.filter(q => st.categoryIds.includes(q.category));
                const totalInStage = stageQuestions.length;
                const masteredInStage = stageQuestions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
                const pct = totalInStage > 0 ? Math.round((masteredInStage / totalInStage) * 100) : 0;
                const isCompleted = totalInStage > 0 && masteredInStage === totalInStage;
                const expanded = !!expandedStages[st.id];

                // Filter stage questions against the user filters
                const filteredStageQuestions = getFilteredQuestionsForStage(stageQuestions);

                return (
                  <div
                    id={`stage-panel-${st.id}`}
                    key={st.id}
                    className={`bg-white dark:bg-[#111520] border rounded-2xl shadow-xs p-5 sm:p-6 transition-all space-y-4 ${
                      isCompleted
                        ? 'border-emerald-500/35 dark:border-emerald-500/20 bg-emerald-500/[0.015]'
                        : 'border-slate-200 dark:border-slate-800/80'
                    }`}
                  >
                    
                    {/* Stage Panel Header */}
                    <div 
                      onClick={() => toggleStageExpand(st.id)}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            Этап {st.id}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <div className="text-xs font-bold text-slate-400">
                            {st.subtitle}
                          </div>
                        </div>
       
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          <span className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                            {renderStageIcon(st.iconName, "w-4 h-4")}
                          </span>
                          <span>{st.title}</span>
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 leading-normal max-w-2xl">
                          {st.description}
                        </p>
                      </div>

                      {/* Progress Indicators inside current stage */}
                      <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                          <span className="text-xs font-black text-slate-500 dark:text-slate-400">
                            {masteredInStage} из {totalInStage} изучено ({pct}%)
                          </span>
                          <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 bg-slate-50 dark:bg-[#0c0f16] border border-slate-200 dark:border-slate-800 rounded-lg">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        <div className="w-full md:w-48 h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Accordion Questions Area */}
                    {expanded && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 animate-fadeIn space-y-4">
                        {filteredStageQuestions.length === 0 ? (
                          <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                            {searchTerm || selectedDifficulty !== 'all' || statusFilter !== 'all' ? (
                              <span>Нет вопросов, соответствующих вашим поисковым фильтрам.</span>
                            ) : (
                              <span>В данном модуле пока отсутствуют вопросы.</span>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredStageQuestions.map((q) => {
                              const isMastered = progress.masteredQuestionIds.includes(q.id);
                              const isBookmarked = progress.bookmarkedQuestionIds.includes(q.id);

                              return (
                                <div
                                  key={q.id}
                                  onClick={() => setSelectedQuestion(q)}
                                  className={`p-5 rounded-2xl bg-white dark:bg-[#121620] border transition-all flex flex-col justify-between h-[240px] shadow-xs group relative hover:shadow-md cursor-pointer ${
                                    isMastered 
                                      ? 'border-emerald-500/40 bg-emerald-500/[0.015]' 
                                      : 'border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/30'
                                  }`}
                                >
                                  {/* Card Body */}
                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tracking-wider">
                                        {q.category.toUpperCase()}
                                      </span>
                                      
                                      <div className="flex items-center space-x-1.5">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                                          q.difficulty === 'Senior' 
                                            ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400' 
                                            : q.difficulty === 'Middle' 
                                            ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400' 
                                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                          {q.difficulty}
                                        </span>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleBookmark(q.id);
                                          }}
                                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                            isBookmarked 
                                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' 
                                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                          }`}
                                          title={isBookmarked ? 'В закладках' : 'В закладки'}
                                        >
                                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                      </div>
                                    </div>

                                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                                      {q.title}
                                    </h4>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                      {q.summaryAnswer}
                                    </p>
                                  </div>

                                  {/* Card Actions Footer */}
                                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3">
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={() => setSelectedQuestion(q)}
                                        className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                      >
                                        <span>Читать ответ</span>
                                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onToggleMastered(q.id);
                                        }}
                                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                          isMastered
                                            ? 'bg-emerald-500 text-slate-950 shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/20'
                                        }`}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{isMastered ? 'Изучено' : 'Знаю'}</span>
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* ================ 2. PREMIUM IN-PLACE BENTO DETAIL VIEW ================== */
          /* ========================================================================= */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="space-y-6"
          >
            {/* Top Back Navigation Hub */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111520] border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-xs">
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setEditingNoteId(null);
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0f16] dark:hover:bg-[#1a202e] text-slate-800 dark:text-slate-200 text-xs font-black border border-slate-200 dark:border-slate-800 transition-colors self-start cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Вернуться к этапам</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tracking-wider border border-slate-200/50 dark:border-slate-700/50">
                  {selectedQuestion.category.toUpperCase()}
                </span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider border ${
                  selectedQuestion.difficulty === 'Senior' 
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400' 
                    : selectedQuestion.difficulty === 'Middle' 
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {selectedQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Core Question Header Card */}
            <div className="bg-white dark:bg-[#111520] border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider block">РАЗБОР ВОПРОСА</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {selectedQuestion.title}
              </h2>
              {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedQuestion.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg border border-slate-200/40 dark:border-slate-800/40">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bento Grid layout containing details */}
            <div className="grid grid-cols-12 gap-5">
              
              {/* Left Column (Theory and Code) - 8 span */}
              <div className="col-span-12 lg:col-span-8 space-y-5">
                
                {/* TL;DR Quick Summary Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5">
                  <span className="font-black text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Краткая выжимка (TL;DR):
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-extrabold text-sm sm:text-base leading-relaxed">
                    {selectedQuestion.summaryAnswer}
                  </p>
                </div>

                {/* Extensive Technical Breakdown Box */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3.5">
                  <span className="font-black text-[10px] text-emerald-500 tracking-wider block">
                    РАЗВЕРНУТЫЙ ТЕХНИЧЕСКИЙ ОТВЕТ:
                  </span>
                  <div className="markdown-body text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-3">
                    <Markdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-base font-black mt-4 mb-2 text-slate-900 dark:text-white" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-sm font-extrabold mt-3 mb-1.5 text-slate-900 dark:text-white" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xs font-bold mt-2.5 mb-1 text-slate-900 dark:text-white" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2.5 last:mb-0 leading-relaxed font-medium" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2.5 space-y-1 marker:text-emerald-500" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2.5 space-y-1 marker:text-emerald-500" {...props} />,
                        li: ({node, ...props}) => <li className="pl-0.5" {...props} />,
                        code: ({className, children, ...props} : any) => {
                          const isBlock = String(children).includes('\n') || (className && className.includes('language-'));
                          return isBlock ? (
                            <pre className="p-3 my-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 overflow-x-auto font-mono text-xs">
                              <code className={className} {...props}>{children}</code>
                            </pre>
                          ) : (
                            <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400" {...props}>
                              {children}
                            </code>
                          );
                        },
                        strong: ({node, ...props}) => <strong className="font-black text-slate-950 dark:text-white" {...props} />,
                      }}
                    >
                      {selectedQuestion.fullAnswer}
                    </Markdown>
                  </div>
                </div>

                {/* Simulated MacOS Code Terminal */}
                {selectedQuestion.codeSnippet && (
                  <div className="relative group rounded-2xl overflow-hidden bg-[#06080c] border border-slate-800/80 p-4 font-mono text-xs text-emerald-400 shadow-lg">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-slate-400 text-[10px] font-bold">
                      <span className="flex items-center space-x-2">
                        <span className="flex space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pl-1 text-[9px]">
                          {selectedQuestion.codeSnippet.language || 'config'}
                        </span>
                      </span>
                      
                      <button
                        onClick={() => handleCopyCode(getCodeString(selectedQuestion.codeSnippet), selectedQuestion.id)}
                        className="flex items-center space-x-1 bg-[#121620] hover:bg-[#1a202e] px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        {copiedCodeId === selectedQuestion.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Копировать</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[11px] sm:text-xs text-slate-100 p-1">
                      {getCodeString(selectedQuestion.codeSnippet)}
                    </pre>
                  </div>
                )}

              </div>

              {/* Right Column (Interview tips, Mistakes, Personal Notes) - 4 span */}
              <div className="col-span-12 lg:col-span-4 space-y-5">
                
                {/* Pro Tips from Real SRE Interviews */}
                {((selectedQuestion.interviewTips && selectedQuestion.interviewTips.length > 0) || (selectedQuestion as any).interviewTip) && (
                  <div className="p-5 rounded-2xl bg-amber-500/[0.03] dark:bg-amber-500/[0.015] border border-amber-500/20 text-amber-800 dark:text-amber-200/90 space-y-3 shadow-xs">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                      <span className="font-black text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">Совет с собеседования:</span>
                    </div>
                    {selectedQuestion.interviewTips ? (
                      <ul className="list-disc list-inside space-y-2 text-xs leading-relaxed pl-1">
                        {selectedQuestion.interviewTips.map((tip: string, idx: number) => (
                          <li key={idx} className="marker:text-amber-500/60 leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs leading-relaxed">{(selectedQuestion as any).interviewTip}</p>
                    )}
                  </div>
                )}

                {/* Common candidate pitfalls */}
                {selectedQuestion.commonPitfalls && selectedQuestion.commonPitfalls.length > 0 && (
                  <div className="p-5 rounded-2xl bg-rose-500/[0.03] dark:bg-rose-500/[0.015] border border-rose-500/20 text-rose-800 dark:text-rose-200/90 space-y-3 shadow-xs">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                      <span className="font-black text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400">Ошибки кандидатов:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-xs leading-relaxed pl-1">
                      {selectedQuestion.commonPitfalls.map((pit: string, idx: number) => (
                        <li key={idx} className="marker:text-rose-500/60 leading-relaxed">{pit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fully functional personal notes box */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-xs">Личные заметки:</span>
                    </span>
                    {editingNoteId !== selectedQuestion.id && (
                      <button
                        onClick={() => handleOpenNote(selectedQuestion.id)}
                        className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer bg-transparent"
                      >
                        {progress.customNotes[selectedQuestion.id] ? 'Редактировать' : 'Добавить'}
                      </button>
                    )}
                  </div>
                  
                  {editingNoteId === selectedQuestion.id ? (
                    <div className="space-y-2.5 animate-fadeIn">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Запишите сюда свои шпаргалки, команды консоли или нюансы настройки..."
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        rows={4}
                      />
                      <div className="flex justify-end space-x-1.5">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold cursor-pointer"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={() => handleSaveNoteAction(selectedQuestion.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-bold cursor-pointer animate-pulse"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ) : (
                    progress.customNotes[selectedQuestion.id] ? (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 text-xs text-slate-600 dark:text-slate-300 italic whitespace-pre-line leading-relaxed">
                        {progress.customNotes[selectedQuestion.id]}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">Заметки отсутствуют. Нажмите кнопку выше для добавления заметок по вопросу.</p>
                    )
                  )}
                </div>

              </div>

            </div>

            {/* Sticky/Stable Bottom Navigation Control Panel */}
            <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-[#111520]/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Previous / Next Question Selectors */}
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  disabled={!prevQuestion}
                  onClick={() => {
                    if (prevQuestion) {
                      setSelectedQuestion(prevQuestion);
                      setEditingNoteId(null);
                    }
                  }}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    prevQuestion 
                      ? 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0f16] dark:hover:bg-[#141924] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 cursor-pointer' 
                      : 'opacity-40 cursor-not-allowed border-slate-100 dark:border-slate-900 text-slate-400'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Назад</span>
                </button>

                <span className="text-xs font-black text-slate-400 dark:text-slate-500">
                  Вопрос {currentIndex + 1} из {filteredList.length}
                </span>

                <button
                  disabled={!nextQuestion}
                  onClick={() => {
                    if (nextQuestion) {
                      setSelectedQuestion(nextQuestion);
                      setEditingNoteId(null);
                    }
                  }}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    nextQuestion 
                      ? 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0f16] dark:hover:bg-[#141924] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 cursor-pointer' 
                      : 'opacity-40 cursor-not-allowed border-slate-100 dark:border-slate-900 text-slate-400'
                  }`}
                >
                  <span className="hidden xs:inline">Вперед</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons: Bookmarks & Mastered toggle */}
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => onToggleBookmark(selectedQuestion.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    progress.bookmarkedQuestionIds.includes(selectedQuestion.id)
                      ? 'bg-amber-500/10 border-amber-500/45 text-amber-500' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>{progress.bookmarkedQuestionIds.includes(selectedQuestion.id) ? 'В закладках' : 'В закладки'}</span>
                </button>

                <button
                  onClick={() => onToggleMastered(selectedQuestion.id)}
                  className={`flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    progress.masteredQuestionIds.includes(selectedQuestion.id)
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-200 hover:bg-emerald-500 dark:bg-slate-800 dark:hover:bg-emerald-500 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-slate-950'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{progress.masteredQuestionIds.includes(selectedQuestion.id) ? 'Изучено' : 'Знаю'}</span>
                </button>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
