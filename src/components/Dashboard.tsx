import React from 'react';
import { CategoryInfo, Question, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { DevOpsRoadmap } from './DevOpsRoadmap';
import { DailyBlitzSection } from './DailyBlitzSection';
import { evaluateAchievements } from '../data/achievements';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  Flame, 
  Bot, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  TrendingUp,
  BrainCircuit,
  Terminal,
  Trophy,
  Lock,
  Check
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
  const bookmarkedCount = progress.bookmarkedQuestionIds.length;
  
  // Flashcards due for review
  const flashcardsDueCount = Object.values(progress.flashcardBoxes || {}).filter(b => b === 1 || b === 2).length || 5;

  // Achievements
  const achievements = evaluateAchievements(progress, questions);
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const previewAchievements = achievements.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-950 border border-emerald-500/30 p-6 sm:p-8 text-slate-900 dark:text-white shadow-lg shadow-emerald-950/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>DevOps Interview Readiness Matrix</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Подготовка к собеседованию DevOps Engineer
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Систематическое заучивание вопросов, подготовка легенды коммерческого опыта, разбор аварий в продакшене и симулятор технического собеседования с AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('flashcards')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Учить карточки ({flashcardsDueCount})</span>
              </button>

              <button
                onClick={() => onNavigate('interview')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 font-bold text-xs transition-all shadow-xs"
              >
                <Bot className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Запустить AI Собеседование</span>
              </button>
            </div>
          </div>

          {/* Large Readiness Score Gauge */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[200px] shadow-xs text-center">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Индекс Готовности</span>
            <div className="relative my-3 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-emerald-500 dark:text-emerald-400 transition-all duration-1000"
                  fill="transparent"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * readinessScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-3xl font-black text-slate-900 dark:text-white">{readinessScore}%</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Изучено <span className="text-slate-900 dark:text-white font-bold">{masteredCount}</span> из <span className="text-slate-900 dark:text-white font-bold">{totalQuestions}</span> вопросов
            </div>
          </div>
        </div>
      </div>

      {/* Daily Blitz Test Section */}
      <DailyBlitzSection
        progress={progress}
        onUpdateProgress={onUpdateProgress}
      />

      {/* DevOps Path Roadmap Component */}
      <DevOpsRoadmap
        questions={questions}
        progress={progress}
        onNavigate={onNavigate}
      />

      {/* Achievements & Badges Widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Система Достижений (Badges)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Получено {unlockedCount} из {achievements.length} карьерных бейджей
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('achievements')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>Все бейджи ({unlockedCount}/{achievements.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Badge Quick Preview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {previewAchievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => onNavigate('achievements')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                ach.isUnlocked
                  ? `${ach.bgLight} border-slate-200/80 dark:border-slate-800 hover:scale-[1.02]`
                  : 'bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800/60 opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`p-2 rounded-xl text-xs shrink-0 ${
                ach.isUnlocked
                  ? `${ach.color} shadow-xs`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {ach.isUnlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {ach.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {ach.isUnlocked ? 'Открыто' : `${ach.currentValue}/${ach.goalValue}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Hub Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <span>Быстрый старт и тренировка</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Flashcards */}
          <div 
            onClick={() => onNavigate('flashcards')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Интервалы
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-500 transition-colors">
              Заучивание карточек
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Алгоритм Лейтнера для запоминания определений и команд.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Учить сейчас</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Legend Builder */}
          <div 
            onClick={() => onNavigate('legend')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                Легенда
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
              Конструктор Легенды
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Убедительный рассказ о проекте, стеке и разборе факапов.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Составить легенду</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: Incidents */}
          <div 
            onClick={() => onNavigate('incidents')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                Практика
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-rose-500 transition-colors">
              Симулятор Аварий
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Диагностика CrashLoopBackOff, дисков, сетей и OOMKilled в Prod.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Решить кейс</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: AI Mock Interview */}
          <div 
            onClick={() => onNavigate('interview')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                AI Тренажер
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-500 transition-colors">
              Мок-Собеседование
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Техлид с AI проверяет ваши знания и дает глубокий разбор ответов.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Начать диалог</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Categories Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>Разделы и разделение по стеку</span>
          </h2>
          <button 
            onClick={() => onNavigate('questions')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Смотреть все вопросы ({totalQuestions}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const catQuestions = questions.filter(q => q.category === cat.id);
            const catMastered = catQuestions.filter(q => progress.masteredQuestionIds.includes(q.id)).length;
            const percent = catQuestions.length > 0 ? Math.round((catMastered / catQuestions.length) * 100) : 0;

            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('questions', cat.id)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {percent}%
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-3">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Изучено {catMastered} из {catQuestions.length}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
