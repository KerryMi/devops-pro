import React, { useState, useEffect } from 'react';
import { IncidentScenario, CategoryId } from '../../types';
import { INCIDENT_SCENARIOS } from '../../data/incidents';
import { CATEGORIES } from '../../data/categories';
import { 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  Flame,
  Clock,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  FileText,
  X,
  Play,
  Activity,
  Layers,
  HelpCircle,
  Zap,
  Filter,
  CheckCircle
} from 'lucide-react';

interface IncidentsViewProps {
  onSolveIncident?: (scenarioId: string) => void;
  solvedIncidentIds?: string[];
  initialCategory?: CategoryId;
}

type TabType = 'diagnostics' | 'fix' | 'postmortem';

export const IncidentsView: React.FC<IncidentsViewProps> = ({ 
  onSolveIncident, 
  solvedIncidentIds = [],
  initialCategory 
}) => {
  // Navigation & View State
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  
  // Catalog Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory || 'all');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Junior' | 'Middle' | 'Senior'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Incident Workbench State
  const [activeTab, setActiveTab] = useState<TabType>('diagnostics');
  const [executedCommands, setExecutedCommands] = useState<number[]>([]);
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Esc key listener to exit full-page workbench
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeScenarioId) {
        setActiveScenarioId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScenarioId]);

  // Scroll to top when opening or switching scenario
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeScenarioId]);

  // Current active scenario object
  const currentScenario = INCIDENT_SCENARIOS.find(sc => sc.id === activeScenarioId) || null;
  const currentScenarioIndex = currentScenario 
    ? INCIDENT_SCENARIOS.findIndex(sc => sc.id === currentScenario.id) 
    : -1;

  // Filtered catalog list
  const filteredScenarios = INCIDENT_SCENARIOS.filter(sc => {
    const matchesCategory = selectedCategory === 'all' || sc.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || sc.difficulty === selectedDifficulty;
    const isSolved = solvedIncidentIds.includes(sc.id);
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'solved' 
        ? isSolved 
        : !isSolved;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      sc.title.toLowerCase().includes(query) ||
      sc.category.toLowerCase().includes(query) ||
      sc.symptoms.some(s => s.toLowerCase().includes(query)) ||
      sc.rootCause.toLowerCase().includes(query)
    );

    return matchesCategory && matchesDifficulty && matchesStatus && matchesSearch;
  });

  // Solved counter
  const solvedCount = INCIDENT_SCENARIOS.filter(sc => solvedIncidentIds.includes(sc.id)).length;
  const progressPercent = Math.round((solvedCount / INCIDENT_SCENARIOS.length) * 100);

  // Handlers for Workbench
  const handleOpenScenario = (sc: IncidentScenario) => {
    setActiveScenarioId(sc.id);
    setExecutedCommands([]);
    setSelectedFixId(null);
    setShowSolution(solvedIncidentIds.includes(sc.id));
    setActiveTab('diagnostics');
    setShowHint({});
  };

  const handleRunCommand = (idx: number) => {
    if (!executedCommands.includes(idx)) {
      setExecutedCommands(prev => [...prev, idx]);
    }
  };

  const handleRunAllCommands = (sc: IncidentScenario) => {
    const allIndices = sc.diagnosticSteps.map((_, i) => i);
    setExecutedCommands(allIndices);
  };

  const handleSelectFix = (fixId: string, sc: IncidentScenario) => {
    setSelectedFixId(fixId);
    const chosenFix = sc.fixOptions.find(f => f.id === fixId);
    if (chosenFix?.isCorrect) {
      setShowSolution(true);
      if (onSolveIncident) {
        onSolveIncident(sc.id);
      }
      // Automatically switch to post-mortem after a tiny delay
      setTimeout(() => {
        setActiveTab('postmortem');
      }, 800);
    }
  };

  const handleResetWorkbench = () => {
    setExecutedCommands([]);
    setSelectedFixId(null);
    setShowSolution(false);
    setActiveTab('diagnostics');
    setShowHint({});
  };

  const handleCopyCommand = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const handlePrevScenario = () => {
    if (currentScenarioIndex > 0) {
      const prevSc = INCIDENT_SCENARIOS[currentScenarioIndex - 1];
      handleOpenScenario(prevSc);
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < INCIDENT_SCENARIOS.length - 1) {
      const nextSc = INCIDENT_SCENARIOS[currentScenarioIndex + 1];
      handleOpenScenario(nextSc);
    }
  };

  // Helper for Severity Badge
  const getSeverity = (difficulty: string) => {
    if (difficulty === 'Senior') return { label: 'P1 CRITICAL', color: 'bg-rose-500/15 text-rose-500 border-rose-500/30' };
    if (difficulty === 'Middle') return { label: 'P2 MAJOR', color: 'bg-amber-500/15 text-amber-500 border-amber-500/30' };
    return { label: 'P3 MINOR', color: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' };
  };

  // =========================================================================
  // RENDER FULL-PAGE WORKBENCH (if an incident is selected)
  // =========================================================================
  if (currentScenario) {
    const isSolved = solvedIncidentIds.includes(currentScenario.id);
    const severity = getSeverity(currentScenario.difficulty);
    const chosenFix = currentScenario.fixOptions.find(f => f.id === selectedFixId);
    const allDiagnosticsRun = executedCommands.length === currentScenario.diagnosticSteps.length;

    return (
      <div className="min-h-screen space-y-6 pb-20 animate-fadeIn text-slate-900 dark:text-slate-100">
        
        {/* Top Sticky/Floating Navigation Header */}
        <div className="sticky top-2 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={() => setActiveScenarioId(null)}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">К списку аварий</span>
              <span className="sm:hidden text-[11px]">Назад</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            <div className="flex items-center space-x-1.5 min-w-0">
              <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded border shrink-0 ${severity.color}`}>
                {severity.label.split(' ')[0]}
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold truncate text-slate-900 dark:text-white max-w-[120px] xs:max-w-[180px] sm:max-w-[350px] lg:max-w-[500px]">
                {currentScenario.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={handleResetWorkbench}
              title="Сбросить прогресс симуляции"
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-1.5 ml-0.5">
              <button
                disabled={currentScenarioIndex <= 0}
                onClick={handlePrevScenario}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Предыдущая авария"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                disabled={currentScenarioIndex >= INCIDENT_SCENARIOS.length - 1}
                onClick={handleNextScenario}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Следующая авария"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width Incident Context Header Banner */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-[#111827] dark:to-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md relative overflow-hidden space-y-3 sm:space-y-4">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3 sm:pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">
                  {severity.label}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {currentScenario.category.toUpperCase()}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  {currentScenario.difficulty}
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {currentScenario.title}
              </h1>
            </div>

            {/* Quick Status Pill */}
            <div className="inline-flex items-center justify-between md:justify-end space-x-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs shrink-0 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Прогресс:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>{executedCommands.length}/{currentScenario.diagnosticSteps.length} шагов</span>
              </span>
            </div>
          </div>

          {/* Reported Symptoms & Initial Incident Log */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-3 pt-0.5">
            <div className="space-y-1.5 bg-white/80 dark:bg-slate-950/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Симптомы сбоя:</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                {currentScenario.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentScenario.initialLogs && (
              <div className="space-y-1.5 bg-slate-100/90 dark:bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-300">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span>Системный журнал:</span>
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500">STDERR</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre max-h-24 scrollbar-thin text-[11px] leading-tight max-w-full">
                  {currentScenario.initialLogs}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Workbench Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-1.5 overflow-x-auto no-scrollbar flex-nowrap">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1. Диагностика ({executedCommands.length}/{currentScenario.diagnosticSteps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fix')}
            className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'fix'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2. Исправление</span>
            {selectedFixId && (
              <span className={`w-2 h-2 rounded-full ${chosenFix?.isCorrect ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            )}
          </button>

          {showSolution && (
            <button
              onClick={() => setActiveTab('postmortem')}
              className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                activeTab === 'postmortem'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>3. Post-Mortem</span>
            </button>
          )}
        </div>

        {/* TAB 1: INTERACTIVE TERMINAL DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Terminal Top Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-[#121927] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span>Терминал диагностики</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Выполняйте команды по порядку для анализа сбоя.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleRunAllCommands(currentScenario)}
                  className="w-full sm:w-auto px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Выполнить все</span>
                </button>
              </div>
            </div>

            {/* SRE Terminal Console Window */}
            <div className="rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
              {/* Terminal Window Header Bar */}
              <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 pl-1.5">
                    bash (oncall@bastion)
                  </span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 hidden xs:block">
                  SESSION ACTIVE
                </div>
              </div>

              {/* Diagnostic Command Steps List inside Terminal */}
              <div className="p-3 sm:p-5 space-y-4 sm:space-y-6 font-mono text-xs">
                {currentScenario.diagnosticSteps.map((step, idx) => {
                  const isExecuted = executedCommands.includes(idx);
                  const isHintOpen = !!showHint[idx];

                  return (
                    <div key={idx} className="space-y-2.5 border-b border-slate-200 dark:border-slate-800/80 pb-4 sm:pb-6 last:border-0 last:pb-0">
                      
                      {/* Command Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-200/50 dark:bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 overflow-x-auto min-w-0 max-w-full scrollbar-thin pb-1 sm:pb-0">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">$</span>
                          <span className="font-bold text-slate-900 dark:text-white selection:bg-amber-500/30 text-xs sm:text-xs whitespace-nowrap">{step.command}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() => handleCopyCommand(step.command, idx)}
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                            title="Скопировать команду"
                          >
                            {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {step.hint && (
                            <button
                              onClick={() => setShowHint(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className={`px-2 py-1 rounded-lg text-[10px] font-sans font-bold transition-colors cursor-pointer ${
                                isHintOpen 
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40' 
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              💡 Подсказка
                            </button>
                          )}

                          <button
                            onClick={() => handleRunCommand(idx)}
                            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                              isExecuted
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xs'
                            }`}
                          >
                            {isExecuted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Выполнено</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Запустить</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Optional Hint Box */}
                      {isHintOpen && step.hint && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-sans text-xs flex items-start space-x-2 animate-fadeIn">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold">Подсказка:</strong> {step.hint}
                          </div>
                        </div>
                      )}

                      {/* Command Terminal Output Stream */}
                      {isExecuted ? (
                        <div className="p-3 sm:p-4 rounded-xl bg-slate-950 dark:bg-[#04070d] border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre animate-fadeIn text-[11px] sm:text-xs max-h-48 sm:max-h-64 scrollbar-thin shadow-inner max-w-full">
                          <div className="text-[9px] text-slate-500 mb-1 font-sans">--- OUTPUT (CODE 0) ---</div>
                          {step.output}
                        </div>
                      ) : (
                        <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-600 italic font-sans px-1">
                          Нажмите "Запустить", чтобы получить вывод консоли...
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Proceed to Fix Callout */}
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Готовы принять решение?
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {allDiagnosticsRun 
                    ? 'Все диагностические команды выполнены! Переходите к выбору решения.'
                    : 'Вы можете выполнить оставшиеся команды или перейти к исправлению.'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('fix')}
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Перейти к исправлению</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: FIX OPTIONS PLAYBOOK */}
        {activeTab === 'fix' && (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            <div className="bg-white dark:bg-[#121927] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Шаг 2: Выбор решения</span>
                </div>
                <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white">
                  Какое действие устранит аварийную ситуацию?
                </h3>
              </div>

              <div className="space-y-2.5 pt-1">
                {currentScenario.fixOptions.map((fix) => {
                  const isChosen = selectedFixId === fix.id;
                  return (
                    <div
                      key={fix.id}
                      onClick={() => handleSelectFix(fix.id, currentScenario)}
                      className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                        isChosen
                          ? fix.isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
                            : 'bg-rose-500/10 border-rose-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-[#090d16] border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start space-x-2.5">
                          <div className={`mt-0.5 p-0.5 sm:p-1 rounded-full border shrink-0 ${
                            isChosen
                              ? fix.isCorrect
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-rose-500 text-white border-rose-400'
                              : 'border-slate-400 dark:border-slate-600'
                          }`}>
                            {isChosen ? (
                              fix.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />
                            ) : (
                              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full" />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                            {fix.text}
                          </span>
                        </div>

                        {isChosen && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                            fix.isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                          }`}>
                            {fix.isCorrect ? 'Верно!' : 'Ошибка'}
                          </span>
                        )}
                      </div>

                      {/* Feedback banner on selection */}
                      {isChosen && (
                        <div className={`p-3 rounded-xl text-xs font-medium leading-relaxed border animate-fadeIn ${
                          fix.isCorrect
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-200'
                        }`}>
                          <strong className="font-bold block mb-0.5">
                            {fix.isCorrect ? '🎉 Авария ликвидирована!' : '⚠️ Неверное решение:'}
                          </strong>
                          {fix.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show solution callout if answered correctly */}
              {showSolution && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setActiveTab('postmortem')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Открыть Post-Mortem</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: POST-MORTEM & ROOT CAUSE */}
        {activeTab === 'postmortem' && (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            <div className="bg-gradient-to-br from-emerald-50/50 to-slate-100 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 border border-emerald-500/30 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Post-Mortem
                    </span>
                    <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                      Разбор первопричины
                    </h3>
                  </div>
                </div>

                <div className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-[11px] sm:text-xs">
                  +150 XP
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Первопричина сбоя (Root Cause):
                  </h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    {currentScenario.rootCause}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Как предотвратить подобные инциденты в будущем:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentScenario.preventionTips.map((tip, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setActiveScenarioId(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Вернуться в каталог аварий
                </button>

                {currentScenarioIndex < INCIDENT_SCENARIOS.length - 1 && (
                  <button
                    onClick={handleNextScenario}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Перейти к следующей аварии</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // RENDER CATALOG VIEW (List of Incident Scenarios)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fadeIn text-slate-900 dark:text-slate-100">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-[#111827] dark:to-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-extrabold border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span>Интерактивный Траблшутинг</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Симулятор Аварий в Production
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Сценарии реальных инцидентов в инфраструктуре Kubernetes, Linux, PostgreSQL, Terraform и Ansible. Открывайте любую аварию в полноразмерном терминале, выполняйте диагностику и устраняйте Root Cause!
            </p>
          </div>

          {/* SRE Readiness Stats Box */}
          <div className="relative z-10 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shrink-0 space-y-3 w-full lg:w-72 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">Прогресс SRE-Дежурного</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{solvedCount} / {INCIDENT_SCENARIOS.length}</span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Готовность:</span>
              <span className="font-bold text-amber-600 dark:text-amber-300">
                {progressPercent === 100 ? 'Senior SRE On-Call' : progressPercent > 50 ? 'Middle Incident Lead' : 'Junior Troubleshooting'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filter Control Bar */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
        
        {/* Search Input & Status Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по авариям (название, симптомы, технологии)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Solved Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#090d16] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Все ({INCIDENT_SCENARIOS.length})
            </button>
            <button
              onClick={() => setStatusFilter('unsolved')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'unsolved'
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Активные ({INCIDENT_SCENARIOS.length - solvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'solved'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Решенные ({solvedCount})
            </button>
          </div>
        </div>

        {/* Category Pills & Difficulty Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Все категории
            </button>
            {CATEGORIES.map(cat => {
              const count = INCIDENT_SCENARIOS.filter(s => s.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.title.split('&')[0]}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center space-x-1 text-xs font-bold shrink-0 self-start sm:self-auto">
            <span className="text-slate-400 mr-1 text-[11px]">Уровень:</span>
            {(['all', 'Junior', 'Middle', 'Senior'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-950 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff === 'all' ? 'Все' : diff}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Incident Catalog Cards Grid */}
      {filteredScenarios.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto opacity-60" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Аварий по выбранным фильтрам не найдено
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Попробуйте сбросить поисковый запрос или выбрать другую категорию.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((sc) => {
            const isSolved = solvedIncidentIds.includes(sc.id);
            const severity = getSeverity(sc.difficulty);

            return (
              <div
                key={sc.id}
                onClick={() => handleOpenScenario(sc)}
                className={`p-5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group shadow-sm hover:shadow-xl ${
                  isSolved
                    ? 'bg-white dark:bg-[#0f172a] border-emerald-500/30 hover:border-emerald-500'
                    : 'bg-white dark:bg-[#121927] border-slate-200 dark:border-slate-800 hover:border-amber-500/60'
                }`}
              >
                {/* Background Subtle Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 group-hover:bg-amber-500/10 rounded-full blur-2xl transition-all pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${severity.color}`}>
                        {severity.label}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {sc.category}
                      </span>
                    </div>

                    {isSolved ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center space-x-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Решено</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-black flex items-center space-x-1 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                        <span>Активна</span>
                      </span>
                    )}
                  </div>

                  {/* Incident Title */}
                  <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                    {sc.title}
                  </h3>

                  {/* Symptoms Summary */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {sc.symptoms[0]}
                  </p>
                </div>

                {/* Card Footer Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs relative z-10">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>~5 мин</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenScenario(sc);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isSolved
                        ? 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-700 dark:text-slate-200'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xs'
                    }`}
                  >
                    <span>{isSolved ? 'Разбор' : 'Расследовать'}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
