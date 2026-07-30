import React from 'react';
import { CategoryId, Question, UserProgress } from '../types';
import { DailyBlitzSection } from './DailyBlitzSection';
import { DashboardAchievementsWidget } from './DashboardAchievementsWidget';
import { SkillOfDayCard } from './SkillOfDayCard';
import { evaluateAchievements } from '../data/achievements';
import { calculateUserGamification } from '../utils/gamification';
import { calculateDetailedReadiness } from '../utils/readiness';
import { calculateStageActivityStats } from '../utils/roadmapUtils';
import { RankAvatar } from './RankAvatar';
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
  Globe,
  Box,
  GitBranch,
  Layers,
  Cpu,
  Activity,
  Cloud,
  Compass,
  Zap,
  Target,
  Bookmark,
  ShieldAlert,
  ArrowUpRight,
  ChevronRight,
  Star
} from 'lucide-react';

interface StageConfig {
  step: number;
  categoryId: CategoryId;
  name: string;
  icon: React.ElementType;
}

const STAGES: StageConfig[] = [
  { step: 1, categoryId: 'linux', name: 'Linux', icon: Terminal },
  { step: 2, categoryId: 'networking', name: 'Networks', icon: Globe },
  { step: 3, categoryId: 'docker', name: 'Docker', icon: Box },
  { step: 4, categoryId: 'cicd', name: 'CI/CD', icon: GitBranch },
  { step: 5, categoryId: 'k8s', name: 'Kubernetes', icon: Layers },
  { step: 6, categoryId: 'terraform', name: 'IaC', icon: Cpu },
  { step: 7, categoryId: 'monitoring', name: 'Metrics', icon: Activity },
  { step: 8, categoryId: 'cloud', name: 'Cloud', icon: Cloud }
];

interface DashboardProps {
  progress: UserProgress;
  questions: Question[];
  onNavigate: (tab: any, filterCategory?: string) => void;
  readinessScore: number;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
  unseenAchievementsCount?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  questions,
  onNavigate,
  readinessScore,
  onUpdateProgress = () => {},
  unseenAchievementsCount = 0
}) => {
  const masteredCount = progress.masteredQuestionIds.length;
  const totalQuestions = questions.length;
  const flashcardsDueCount = Object.values(progress.flashcardBoxes || {}).filter(b => b === 1 || b === 2).length || 5;

  const achievements = evaluateAchievements(progress, questions);
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalIncidents = INCIDENT_SCENARIOS.length;
  const solvedIncidentsCount = (progress.solvedIncidentIds || []).length;
  const totalQuizzesCount = (progress.quizResults || []).length;

  // Funny IT Rank Calculation
  const gamification = calculateUserGamification(progress, questions);

  // Detailed Interview Readiness Calculation
  const detailedReadiness = calculateDetailedReadiness(progress, questions);

  // Roadmap Stage Progress Calculations
  const stageStats = STAGES.map(s => {
    const stats = calculateStageActivityStats(s.categoryId, questions, progress);
    return {
      ...s,
      stats
    };
  });

  const completedCount = stageStats.filter(s => s.stats.overallPercent >= 80).length;
  const overallPercent = detailedReadiness.totalScore;

  const sortedByPercent = [...stageStats].sort((a, b) => a.stats.overallPercent - b.stats.overallPercent);
  const recommendedStage = sortedByPercent.find(s => s.stats.overallPercent < 80) || sortedByPercent[0];
  const recActivity = recommendedStage.stats.recommendedActivity;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* SECTION 1: TOP BENTO HEADER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Welcome & Focus Banner */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121927] text-slate-900 dark:text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col space-y-4 relative overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Рекомендация обучения</span>
              </div>
            </div>
            

            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Текущий фокус</h3>
              <p className="text-lg sm:text-xl font-black tracking-tight mt-0.5 text-slate-900 dark:text-white leading-snug">
                {recommendedStage.name}: {recActivity.title}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {recActivity.description}.
              </p>
            </div>

            {/* Transferred Roadmap Focus Blocks (Replacing old quick metrics bar) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Recommended Focus Stage Card */}
              <div 
                onClick={() => onNavigate(recActivity.type, recommendedStage.categoryId)}
                className="sm:col-span-2 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0b1120]/80 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center space-x-3 min-w-0 w-full">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                    <recommendedStage.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded shrink-0">
                        Уровень {recommendedStage.step}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                        {recommendedStage.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {recActivity.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overall Progress Pill */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Общий Roadmap</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono flex items-center space-x-1 mt-0.5">
                    <span>{overallPercent}%</span>
                    <span className="text-xs text-slate-400 font-normal">({completedCount}/8 ветвей)</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <button
              onClick={() => onNavigate(recActivity.type, recommendedStage.categoryId)}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>{recActivity.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Посмотреть полный Roadmap</span>
            </button>
          </div>
        </div>

        {/* Readiness Circular Meter Panel (Bento Analytics) */}
        <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden h-full mobile-word-break transition-colors duration-200">
          
          {/* Ambient subtle glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col h-full justify-between space-y-4 relative z-10">
            <div>
              {/* Header with LED & Level Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">ИНДЕКС ГОТОВНОСТИ</span>
                  <span className="flex h-2 w-2">
                    <span className={`inline-flex rounded-full h-2 w-2 ${
                      detailedReadiness.totalScore >= 80 ? 'bg-emerald-500' : detailedReadiness.totalScore >= 55 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></span>
                  </span>
                </div>
                
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${detailedReadiness.levelBadgeBg}`}>
                  {detailedReadiness.levelTitle}
                </span>
              </div>

              {/* Main Score and Donut Chart */}
              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                      {detailedReadiness.totalScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">/ 100%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Умный расчёт готовности к собеседованию
                  </p>
                </div>

                {/* Donut Chart */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="4.5"
                      className="text-slate-100 dark:text-slate-800/80"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="4.5"
                      className={`${
                        detailedReadiness.totalScore >= 80 ? 'text-emerald-500' : detailedReadiness.totalScore >= 55 ? 'text-blue-500' : 'text-amber-500'
                      } transition-all duration-1000`}
                      fill="transparent"
                      strokeDasharray="163"
                      strokeDashoffset={163 - (163 * detailedReadiness.totalScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 font-mono leading-none">
                      {detailedReadiness.totalScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-Segment Metric Trackers (4 Pillars) */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold">
                  <span>Составляющие готовности</span>
                  <span className="text-[9px] text-slate-500 font-normal">Вес: 35/25/20/10/10%</span>
                </div>
                
                {/* Multi-segment progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex space-x-0.5 p-0.5">
                  {detailedReadiness.pillars.map(pillar => (
                    <div
                      key={pillar.id}
                      className={`h-full ${pillar.color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(4, pillar.score)}%` }}
                      title={`${pillar.label}: ${pillar.pct}%`}
                    />
                  ))}
                </div>

                {/* Mini Pillars Grid */}
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {detailedReadiness.pillars.map(pillar => (
                    <div 
                      key={pillar.id}
                      className="flex flex-col items-center justify-center p-1 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-center"
                    >
                      <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-tighter truncate w-full">
                        {pillar.label}
                      </span>
                      <span className="text-[10px] font-black font-mono text-slate-800 dark:text-slate-200 leading-tight">
                        {pillar.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart AI Recommendation Banner */}
              <button
                onClick={() => onNavigate(detailedReadiness.recommendation.targetTab)}
                className="w-full mt-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 border border-blue-500/15 dark:border-blue-500/25 flex items-center justify-between group hover:border-blue-500/40 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="p-1 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                      {detailedReadiness.recommendation.title}
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">
                      {detailedReadiness.recommendation.advice}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

            {/* Micro KPI Navigation Grid */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => onNavigate('questions')}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-[#121927]/40 border border-slate-100/50 dark:border-slate-800/50 text-left hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="text-[8px] text-slate-400 group-hover:text-blue-500">→</span>
                </div>
                <div className="text-[9px] font-bold text-slate-700 dark:text-slate-300 font-mono mt-1 truncate">
                  {masteredCount}/{totalQuestions}
                </div>
              </button>

              <button
                onClick={() => onNavigate('incidents')}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-[#121927]/40 border border-slate-100/50 dark:border-slate-800/50 text-left hover:border-rose-500/40 hover:bg-rose-500/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="text-[8px] text-slate-400 group-hover:text-rose-500">→</span>
                </div>
                <div className="text-[9px] font-bold text-slate-700 dark:text-slate-300 font-mono mt-1 truncate">
                  {solvedIncidentsCount}/{totalIncidents}
                </div>
              </button>

              <button
                onClick={() => onNavigate('flashcards')}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-[#121927]/40 border border-slate-100/50 dark:border-slate-800/50 text-left hover:border-amber-500/40 hover:bg-amber-500/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <BrainCircuit className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="text-[8px] text-slate-400 group-hover:text-amber-500">→</span>
                </div>
                <div className="text-[9px] font-bold text-slate-700 dark:text-slate-300 font-mono mt-1 truncate">
                  {Object.keys(progress.flashcardBoxes || {}).length} шт.
                </div>
              </button>

              <button
                onClick={() => onNavigate('quizzes')}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-[#121927]/40 border border-slate-100/50 dark:border-slate-800/50 text-left hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <Target className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="text-[8px] text-slate-400 group-hover:text-emerald-500">→</span>
                </div>
                <div className="text-[9px] font-bold text-slate-700 dark:text-slate-300 font-mono mt-1 truncate">
                  {totalQuizzesCount} раз
                </div>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 1: GAMIFICATION & DAILY BLITZ 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <DashboardAchievementsWidget
          progress={progress}
          questions={questions}
          onNavigate={onNavigate}
          unseenAchievementsCount={unseenAchievementsCount}
        />

        <DailyBlitzSection
          progress={progress}
          onUpdateProgress={onUpdateProgress}
        />
      </div>

      {/* SECTION 2: SKILL OF THE DAY (FULL-WIDTH FEATURED CARD) */}
      <SkillOfDayCard onNavigate={onNavigate} />

    </div>
  );
};
