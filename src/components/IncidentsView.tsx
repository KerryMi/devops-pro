import React, { useState } from 'react';
import { IncidentScenario, CategoryId } from '../types';
import { INCIDENT_SCENARIOS } from '../data/incidents';
import { CATEGORIES } from '../data/categories';
import { 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle,
  ShieldCheck,
  Filter,
  Flame,
  Award
} from 'lucide-react';

interface IncidentsViewProps {
  onSolveIncident?: (scenarioId: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({ onSolveIncident }) => {
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-semibold border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Интерактивный Траблшутинг</span>
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
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-200'
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
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-200'
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

      {/* Scenario Selector Cards Horizontal Scroll / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredScenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                handleReset();
              }}
              className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-100 ring-1 ring-rose-500/30 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {sc.category}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    sc.difficulty === 'Senior' ? 'bg-rose-500/20 text-rose-400' : sc.difficulty === 'Middle' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {sc.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-tight">
                  {sc.title}
                </h4>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{sc.symptoms[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Incident Interactive Stage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        
        {/* Scenario Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              {selectedScenario.category} • {selectedScenario.difficulty} Level
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {selectedScenario.title}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить симуляцию</span>
          </button>
        </div>

        {/* Symptoms Alert Box */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
          <div className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Симптомы Аварии в Prod:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1">
            {selectedScenario.symptoms.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Initial Logs Terminal */}
        <div className="space-y-2 min-w-0">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Terminal className="w-4 h-4" />
            <span>Первичные логи сервиса:</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-w-full border border-slate-800">
            <code>{selectedScenario.initialLogs}</code>
          </pre>
        </div>

        {/* Diagnostic Terminal Commands */}
        <div className="space-y-3 min-w-0">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Диагностика (Нажмите на команду для выполнения):
          </div>

          <div className="space-y-3">
            {selectedScenario.diagnosticSteps.map((step, idx) => {
              const isRun = executedCommands.includes(idx);
              return (
                <div key={idx} className="space-y-2 min-w-0">
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
                    <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-w-full border border-slate-800 space-y-2 animate-fadeIn">
                      <pre className="overflow-x-auto max-w-full"><code>{step.output}</code></pre>
                      <div className="text-[11px] font-sans text-amber-400 italic">
                        Подсказка: {step.hint}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fix Selection */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Выберите правильное действие для устранения аварии:
          </div>

          <div className="space-y-2">
            {selectedScenario.fixOptions.map((fix) => {
              const isSelected = selectedFixId === fix.id;
              return (
                <div
                  key={fix.id}
                  onClick={() => handleSelectFix(fix.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? fix.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>{fix.text}</span>
                    {isSelected && (
                      fix.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                    )}
                  </div>
                  {isSelected && (
                    <div className="text-[11px] font-bold pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                      {fix.feedback}
                    </div>
                  )}
                </div>
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
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
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
