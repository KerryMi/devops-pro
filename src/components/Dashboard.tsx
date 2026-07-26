import React from 'react';
import { Question, UserProgress } from '../types';
import { DailyBlitzSection } from './DailyBlitzSection';
import { evaluateAchievements } from '../data/achievements';
import { INCIDENT_SCENARIOS } from '../data/incidents';
import { 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  BookOpen, 
  BrainCircuit,
  Trophy,
  CheckCircle2,
  FileText,
  Terminal,
  Compass,
  Zap,
  Target,
  Bookmark,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  questions: Question[];
  onNavigate: (tab: any, filterCategory?: string) => void;
  readinessScore: number;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  questions,
  onNavigate,
  readinessScore,
  onUpdateProgress = () => {}
}) => {
  const masteredCount = progress.masteredQuestionIds.length;
  const totalQuestions = questions.length;
  const flashcardsDueCount = Object.values(progress.flashcardBoxes || {}).filter(b => b === 1 || b === 2).length || 5;

  const achievements = evaluateAchievements(progress, questions);
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalIncidents = INCIDENT_SCENARIOS.length;
  const solvedIncidentsCount = (progress.solvedIncidentIds || []).length;
  const totalQuizzesCount = (progress.quizResults || []).length;

  // Determine current focus career rank
  const getUserLevelTitle = (count: number) => {
    if (count >= 10) return 'Senior DevOps Architect';
    if (count >= 7) return 'Lead DevOps Engineer';
    if (count >= 4) return 'Middle DevOps Engineer';
    if (count >= 1) return 'Junior DevOps Practitioner';
    return 'DevOps Novice';
  };
  const rankTitle = getUserLevelTitle(unlockedCount);

  // Status calculations for our 4 levels
  const level1Status = masteredCount === totalQuestions 
    ? { text: 'Завершено', style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' }
    : masteredCount > 0 
      ? { text: 'В процессе', style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' }
      : { text: 'Текущий фокус', style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' };

  const level2Status = totalQuizzesCount > 0
    ? { text: 'Запущено', style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' }
    : masteredCount > 5
      ? { text: 'Доступно', style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' }
      : { text: 'Рекомендовано позже', style: 'bg-slate-100 dark:bg-slate-800 text-slate-500' };

  const level3Status = solvedIncidentsCount === totalIncidents
    ? { text: 'Завершено', style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' }
    : solvedIncidentsCount > 0
      ? { text: 'В процессе', style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' }
      : totalQuizzesCount > 0
        ? { text: 'Доступно', style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' }
        : { text: 'Рекомендовано позже', style: 'bg-slate-100 dark:bg-slate-800 text-slate-500' };

  const hasLegend = progress.savedLegend && Object.keys(progress.savedLegend).length > 0;
  const level4Status = hasLegend
    ? { text: 'Завершено', style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' }
    : solvedIncidentsCount > 0
      ? { text: 'Доступно', style: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' }
      : { text: 'Рекомендовано позже', style: 'bg-slate-100 dark:bg-slate-800 text-slate-500' };

  const getCategoryMastery = (catId: string) => {
    const catQuestions = questions.filter(q => q.category === catId);
    if (catQuestions.length === 0) return 0;
    const catMastered = catQuestions.filter(q => progress.masteredQuestionIds.includes(q.id));
    return Math.round((catMastered.length / catQuestions.length) * 100);
  };

  let advisorTip = "Заполните Легенду опыта и резюме на Уровне 4 для завершения курса!";
  if (masteredCount < 10) {
    advisorTip = "Решите новые вопросы на Уровне 1 (+10% к индексу)";
  } else if (totalQuizzesCount === 0) {
    advisorTip = "Запустите Собес-Симулятор на Уровне 2 (+15% к индексу)";
  } else if (solvedIncidentsCount < totalIncidents) {
    advisorTip = "Ликвидируйте инцидент в Prod на Уровне 3 (+12% к индексу)";
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* SECTION 1: TOP BENTO HEADER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Welcome Dashboard Panel (DevOps Interview Pro Map Bento Control Hub) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
          
          {/* Main Status & Recommendation Widget (Bento Tile 1) */}
          <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-slate-200 dark:border-slate-800 h-full mobile-word-break">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Рекомендация ИИ</span>
              </div>
              
              <div className="mobile-word-break">
                <h3 className="text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[9px]">Текущий фокус</h3>
                <p className="text-base font-black tracking-tight mt-1 text-slate-900 dark:text-white leading-snug">
                  {masteredCount < 10 
                    ? "Уровень 1: Теория и Стек"
                    : totalQuizzesCount === 0
                      ? "Уровень 2: Итоговый Собес"
                      : solvedIncidentsCount < totalIncidents 
                        ? "Уровень 3: Аварии в Prod"
                        : "Уровень 4: Карьерная Легенда"}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed truncate md:whitespace-normal block max-w-full">
                  {masteredCount < 10 
                    ? "Освойте базовые понятия Linux, Kubernetes и CI/CD перед созданием резюме."
                    : totalQuizzesCount === 0
                      ? "Запустите итоговый тренажер собеседования с таймером."
                      : solvedIncidentsCount < totalIncidents 
                        ? "Пройдите симуляцию критических инцидентов для подтверждения опыта."
                        : "Сформируйте профессиональное позиционирование и выберите проекты для легенды."}
                </p>
              </div>
              
              {/* Progress and Rank Info */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wide">Ваш Ранг</div>
                  <div className="text-xs font-black text-slate-800 dark:text-slate-200">{rankTitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wide">Бейджи</div>
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">{unlockedCount} / {achievements.length}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (masteredCount < 10) {
                  onNavigate('questions');
                } else if (totalQuizzesCount === 0) {
                  onNavigate('quizzes');
                } else if (solvedIncidentsCount < totalIncidents) {
                  onNavigate('incidents');
                } else {
                  onNavigate('legend');
                }
              }}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-sm hover:scale-[1.01] active:scale-95 transition-all cursor-pointer relative z-10"
            >
              <span>Продолжить путь</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Bento Levels Navigation Map (Bento Tile 2 - spanning 3 columns) */}
          <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden h-full mobile-word-break">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ИНТЕРАКТИВНЫЙ ТРЕКЕР</span>
                <span className="text-[10px] text-emerald-500 font-bold hidden sm:inline">Быстрый переход к модулям</span>
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                DevOps Interview Pro Map
              </h2>
            </div>

            {/* Steps Grid - 2x2 Bento Tiles */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                {
                  id: 'roadmap-level-1',
                  tab: 'questions',
                  title: '1. Стек & База',
                  progress: `${masteredCount}/${totalQuestions}`,
                  percent: Math.round((masteredCount / totalQuestions) * 100),
                  icon: BookOpen,
                  colorClass: masteredCount === totalQuestions ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' : 'text-blue-500 bg-blue-500/10 border-blue-500/15',
                  barColor: 'bg-blue-500',
                  statusText: masteredCount === totalQuestions ? 'Пройдено' : masteredCount > 0 ? 'В процессе' : 'Фокус'
                },
                {
                  id: 'roadmap-level-2',
                  tab: 'quizzes',
                  title: '2. Собеседование',
                  progress: totalQuizzesCount > 0 ? `${totalQuizzesCount} раз` : '0 раз',
                  percent: totalQuizzesCount > 0 ? 100 : 0,
                  icon: Target,
                  colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/15',
                  barColor: 'bg-purple-500',
                  statusText: totalQuizzesCount > 0 ? 'Пройдено' : 'Доступно'
                },
                {
                  id: 'roadmap-level-3',
                  tab: 'incidents',
                  title: '3. Аварии Prod',
                  progress: `${solvedIncidentsCount}/${totalIncidents}`,
                  percent: Math.round((solvedIncidentsCount / totalIncidents) * 100),
                  icon: AlertTriangle,
                  colorClass: solvedIncidentsCount === totalIncidents ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' : 'text-rose-500 bg-rose-500/10 border-rose-500/15',
                  barColor: 'bg-rose-500',
                  statusText: solvedIncidentsCount === totalIncidents ? 'Решено' : solvedIncidentsCount > 0 ? 'В процессе' : 'Доступно'
                },
                {
                  id: 'roadmap-level-4',
                  tab: 'legend',
                  title: '4. Резюме & Легенда',
                  progress: hasLegend ? 'Заполнено' : 'Не создана',
                  percent: hasLegend ? 100 : 0,
                  icon: FileText,
                  colorClass: hasLegend ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' : 'text-amber-500 bg-amber-500/10 border-amber-500/15',
                  barColor: 'bg-amber-500',
                  statusText: hasLegend ? 'Пройдено' : 'Доступно'
                }
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      const el = document.getElementById(step.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="p-2 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-left cursor-pointer transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] dark:hover:bg-emerald-500/[0.02] hover:scale-[1.01] active:scale-95 group/item flex flex-col justify-between h-[64px] sm:h-[92px]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1 rounded-lg border ${step.colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-100 md:opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all duration-200 shrink-0" />
                    </div>

                    <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                      <div className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-slate-200 line-clamp-1">
                        {step.title}
                      </div>
                      <div className="hidden sm:flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-medium font-mono">
                        <span>{step.statusText}</span>
                        <span className="font-bold">{step.progress}</span>
                      </div>
                    </div>

                    {/* Miniature Progress Bar */}
                    <div className="hidden sm:block w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full ${step.barColor} transition-all duration-500`}
                        style={{ width: `${step.percent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Readiness Circular Meter Panel (Bento Analytics) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden h-full mobile-word-break">
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">ИНДЕКС ГОТОВНОСТИ</span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    readinessScore >= 80 ? 'bg-emerald-400' : readinessScore >= 50 ? 'bg-blue-400' : 'bg-amber-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    readinessScore >= 80 ? 'bg-emerald-500' : readinessScore >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></span>
                </span>
              </div>

              {/* Main Score and Donut Chart */}
              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                    {readinessScore}%
                  </div>
                  <div className="mt-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      readinessScore >= 80 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                        : readinessScore >= 50 
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {readinessScore >= 80 ? 'PRO Ready' : readinessScore >= 50 ? 'Middle Ready' : 'DevOps Novice'}
                    </span>
                  </div>
                </div>

                {/* Minimalist donut */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-slate-100 dark:text-slate-800/60"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="4"
                      className={`${
                        readinessScore >= 80 ? 'text-emerald-500' : readinessScore >= 50 ? 'text-blue-500' : 'text-amber-500'
                      } transition-all duration-1000`}
                      fill="transparent"
                      strokeDasharray="163"
                      strokeDashoffset={163 - (163 * readinessScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 font-mono">
                    Score
                  </span>
                </div>
              </div>

              {/* Micro KPI Grid */}
              <div className="flex md:grid md:grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto md:overflow-x-visible pb-1.5 md:pb-0 scrollbar-none snap-x snap-mandatory">
                <div className="shrink-0 snap-start w-[110px] md:w-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider truncate">Теория</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">
                    {masteredCount}/{totalQuestions}
                  </div>
                </div>

                <div className="shrink-0 snap-start w-[110px] md:w-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider truncate">Сбои Prod</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">
                    {solvedIncidentsCount}/{totalIncidents}
                  </div>
                </div>

                <div className="shrink-0 snap-start w-[110px] md:w-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <BrainCircuit className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider truncate">Интервалы</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">
                    {Object.keys(progress.flashcardBoxes || {}).length} шт.
                  </div>
                </div>

                <div className="shrink-0 snap-start w-[110px] md:w-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Target className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider truncate">Тесты</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">
                    {totalQuizzesCount} раз
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: INTERACTIVE DAILY EXERCISE */}
      <DailyBlitzSection
        progress={progress}
        onUpdateProgress={onUpdateProgress}
      />

      {/* SECTION 3: MIM0-STYLE INTERACTIVE LEVEL ROADMAP MAP */}
      <div className="space-y-6">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }} className="px-1">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-500 shrink-0" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Карта
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Пройдите все этапы для 100% готовности</span>
        </div>

        {/* Vertical Mimo-Style Roadmap Chain */}
        <div className="relative pl-8 sm:pl-10 space-y-8 before:absolute before:left-4 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-slate-300 dark:before:to-slate-800">
          
          {/* LEVEL 1 NODE */}
          <div id="roadmap-level-1" className="relative group">
            {/* Mimo Milestone Circle on the Path Line */}
            <div className={`absolute -left-8 sm:-left-10 top-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-md transition-transform group-hover:scale-110 z-10 ${
              masteredCount === totalQuestions
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                : masteredCount > 0
                  ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {masteredCount === totalQuestions ? <CheckCircle2 className="w-4 h-4" /> : '1'}
            </div>

            {/* Card Content */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Уровень 1 • Фундамент</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Базовый Стек & Теория
                    </h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${level1Status.style}`}>
                  {level1Status.text}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Изучите ключевой стек: Linux internals, сети, контейнеризацию, CI/CD, Kubernetes и основы Cloud/IaC.
              </p>

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Освоение вопросов:</span>
                  <span className="font-mono font-bold text-slate-950 dark:text-white">{masteredCount} / {totalQuestions}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(masteredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('questions')}
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <span>Изучать вопросы</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Карточки ({flashcardsDueCount})</span>
                </button>
              </div>
            </div>
          </div>

          {/* LEVEL 2 NODE */}
          <div id="roadmap-level-2" className="relative group">
            {/* Mimo Milestone Circle on the Path Line */}
            <div className={`absolute -left-8 sm:-left-10 top-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-md transition-transform group-hover:scale-110 z-10 ${
              totalQuizzesCount > 0
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {totalQuizzesCount > 0 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
            </div>

            {/* Card Content */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Уровень 2 • Испытание</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Симуляция Собеседования & Тесты
                    </h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${level2Status.style}`}>
                  {level2Status.text}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Проверьте свои силы в комплексных интерактивных тестах, симулирующих вопросы техлидов на реальных интервью с фиксацией времени.
              </p>

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Пройденные тесты:</span>
                  <span className="font-mono font-bold text-slate-950 dark:text-white">{totalQuizzesCount} попыток</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('quizzes')}
                  className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Запустить симулятор</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* LEVEL 3 NODE */}
          <div id="roadmap-level-3" className="relative group">
            {/* Mimo Milestone Circle on the Path Line */}
            <div className={`absolute -left-8 sm:-left-10 top-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-md transition-transform group-hover:scale-110 z-10 ${
              solvedIncidentsCount === totalIncidents
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                : solvedIncidentsCount > 0
                  ? 'bg-rose-500 text-white ring-4 ring-rose-500/20 animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {solvedIncidentsCount === totalIncidents ? <CheckCircle2 className="w-4 h-4" /> : '3'}
            </div>

            {/* Card Content */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Уровень 3 • Практика</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Аварии в Prod & Ликвидация
                    </h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${level3Status.style}`}>
                  {level3Status.text}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Пройдите диагностику реальных сбоев (CrashLoopBackOff, диски, сеть, утечки памяти). Опыт решения аварий — ключевой фактор оценки.
              </p>

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Решенные инциденты:</span>
                  <span className="font-mono font-bold text-slate-950 dark:text-white">{solvedIncidentsCount} из {totalIncidents}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-500"
                    style={{ width: `${(solvedIncidentsCount / totalIncidents) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('incidents')}
                  className="py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Ликвидировать инциденты ({solvedIncidentsCount}/{totalIncidents})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* LEVEL 4 NODE */}
          <div id="roadmap-level-4" className="relative group">
            {/* Mimo Milestone Circle on the Path Line */}
            <div className={`absolute -left-8 sm:-left-10 top-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-md transition-transform group-hover:scale-110 z-10 ${
              hasLegend
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                : solvedIncidentsCount > 0
                  ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {hasLegend ? <CheckCircle2 className="w-4 h-4" /> : '4'}
            </div>

            {/* Card Content */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Уровень 4 • Финал</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Карьерная Легенда & Резюме
                    </h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${level4Status.style}`}>
                  {level4Status.text}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Сформулируйте убедительный коммерческий опыт, опишите стек, архитектуру проекта и подготовьте разбор рабочих кейсов/факапов.
              </p>

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Статус легенды:</span>
                  <span className={`font-bold ${hasLegend ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {hasLegend ? 'Заполнено ✅' : 'Не создана'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('legend')}
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <span>Конструктор Легенды</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('resume')}
                  className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5"
                >
                  <span>Гайд по Резюме</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
