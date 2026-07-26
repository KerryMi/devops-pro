import React, { useState } from 'react';
import { IncidentScenario, CategoryId } from '../types';
import { INCIDENT_SCENARIOS } from '../data/incidents';
import { CATEGORIES } from '../data/categories';
import { 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck
} from 'lucide-react';

interface IncidentsViewProps {
  onSolveIncident?: (scenarioId: string) => void;
  solvedIncidentIds?: string[];
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({ onSolveIncident, solvedIncidentIds = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedScenario, setSelectedScenario] = useState<IncidentScenario>(INCIDENT_SCENARIOS[0]);
  const [executedCommands, setExecutedCommands] = useState<number[]>([]);
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const filteredScenarios = INCIDENT_SCENARIOS.filter(sc => 
    selectedCategory === 'all' || sc.category === selectedCategory
  );

  const handleRunCommand = (idx: number) => {
    if (!executedCommands.includes(idx)) {
      setExecutedCommands([...executedCommands, idx]);
    }
  };

  const handleSelectFix = (fixId: string) => {
    setSelectedFixId(fixId);
    setShowSolution(true);
    const chosenFix = selectedScenario.fixOptions.find(f => f.id === fixId);
    if (chosenFix?.isCorrect && onSolveIncident) {
      onSolveIncident(selectedScenario.id);
    }
  };

  const handleReset = () => {
    setExecutedCommands([]);
    setSelectedFixId(null);
    setShowSolution(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Title Bento Card */}
      <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Интерактивный Траблшутинг & On-Call</span>
          </div>
          <span className="text-xs font-bold text-slate-400">Всего сценариев: {INCIDENT_SCENARIOS.length}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Симулятор Аварий и Дежурств в Production (On-Call Cases)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          На техническом интервью вас попросят расследовать инцидент в реальном времени. Выполняйте диагностические команды в терминале, ищите первопричину (Root Cause) и выберите правильный фикс.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-[#161b26] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-200'
          }`}
        >
          Все направления ({INCIDENT_SCENARIOS.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = INCIDENT_SCENARIOS.filter(s => s.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-[#161b26] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{cat.title.split('&')[0]}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Incident Bento Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredScenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          const isSolved = solvedIncidentIds.includes(sc.id);

          return (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                handleReset();
              }}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-rose-500/10 border-rose-500 text-slate-900 dark:text-white shadow-md'
                  : 'bg-white dark:bg-[#121927] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {/* Top corner status indicator */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                {isSolved ? (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Пройдено</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                    <span>Critical</span>
                  </span>
                )}
              </div>

              <div className="space-y-2 pr-12">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {sc.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    sc.difficulty === 'Senior' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {sc.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                  {sc.title}
                </h4>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {sc.symptoms[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Incident Interactive Workbench */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {selectedScenario.category}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {selectedScenario.difficulty}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white pt-1">
              {selectedScenario.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {selectedScenario.symptoms.join(' • ')}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить симуляцию</span>
          </button>
        </div>

        {/* Terminal Diagnostic Steps */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>Шаг 1: Диагностика в консоли (кликните команду для выполнения):</span>
          </div>

          <div className="space-y-2">
            {selectedScenario.diagnosticSteps.map((step, idx) => {
              const isRun = executedCommands.includes(idx);
              return (
                <div key={idx} className="space-y-2">
                  <button
                    onClick={() => handleRunCommand(idx)}
                    className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-mono text-xs text-left flex items-center justify-between gap-2 border border-slate-800 transition-colors group min-w-0"
                  >
                    <span className="group-hover:text-emerald-400 transition-colors break-all flex-1 min-w-0">$ {step.command}</span>
                    <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-bold shrink-0 ${
                      isRun ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {isRun ? 'Выполнено' : 'Запустить $'}
                    </span>
                  </button>

                  {isRun && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto animate-fadeIn whitespace-pre-wrap">
                      {step.output}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fix Options Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Шаг 2: Выберите корректный фикс для устранения аварии:</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {selectedScenario.fixOptions.map((fix) => {
              const isChosen = selectedFixId === fix.id;
              return (
                <button
                  key={fix.id}
                  onClick={() => handleSelectFix(fix.id)}
                  className={`p-4 rounded-xl text-left border transition-all text-xs sm:text-sm font-medium ${
                    isChosen
                      ? fix.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200'
                      : 'bg-slate-50 dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>{fix.text}</span>
                    {isChosen && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        fix.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {fix.isCorrect ? 'Верно!' : 'Ошибка'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Root Cause Analysis Post-Mortem */}
        {showSolution && (
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Post-Mortem & Первопричина (Root Cause):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedScenario.rootCause}
            </p>
            <div className="text-[11px] font-bold text-slate-400 pt-2 border-t border-emerald-500/20">
              Как предотвратить в будущем:
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300 font-normal">
                {selectedScenario.preventionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
