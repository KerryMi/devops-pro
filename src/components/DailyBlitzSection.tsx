import React, { useState, useMemo } from 'react';
import { QuizQuestion, UserProgress } from '../types';
import { QUIZZES } from '../data/quizzes';
import { 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Check, 
  HelpCircle,
  Clock,
  Play,
  CheckCircle,
  BarChart2,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface DailyBlitzSectionProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

// Extract all quiz questions from QUIZZES
const ALL_QUIZ_QUESTIONS: QuizQuestion[] = QUIZZES.flatMap(q => q.questions);

// Seeded PRNG for consistent daily questions
function getDailyQuestions(dateStr: string): QuizQuestion[] {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const array = [...ALL_QUIZ_QUESTIONS];
  let m = array.length, t, i;
  let s = seed;
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    i = Math.floor(rnd * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array.slice(0, 5);
}

export const DailyBlitzSection: React.FC<DailyBlitzSectionProps> = ({
  progress,
  onUpdateProgress
}) => {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayQuestions = useMemo(() => getDailyQuestions(todayStr), [todayStr]);

  const todayResult = progress.dailyBlitzHistory?.[todayStr];
  const isCompletedToday = Boolean(todayResult);

  const [mode, setMode] = useState<'idle' | 'active' | 'summary'>('idle');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentQ = todayQuestions[currentIdx];

  const handleStartBlitz = () => {
    setMode('active');
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setScore(0);
  };

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // already answered

    const isCorrect = optIdx === currentQ.correctAnswerIndex;
    const newAnswers = { ...selectedAnswers, [currentIdx]: optIdx };
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentIdx < todayQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Finished Blitz!
      const finalScore = Object.entries(selectedAnswers).reduce((acc, [qIdx, ansIdx]) => {
        const q = todayQuestions[Number(qIdx)];
        return ansIdx === q.correctAnswerIndex ? acc + 1 : acc;
      }, 0);

      setScore(finalScore);
      setMode('summary');

      // Update User Progress
      onUpdateProgress(prev => {
        const newHistory = {
          ...(prev.dailyBlitzHistory || {}),
          [todayStr]: {
            score: finalScore,
            total: todayQuestions.length,
            completedAt: new Date().toISOString()
          }
        };

        // Check if streak should be incremented
        let newStreak = prev.dailyStreak;
        if (prev.lastActiveDate !== todayStr) {
          newStreak = prev.dailyStreak + 1;
        }

        // Also add to quizResults for achievements system
        const newQuizResult = {
          id: `blitz-${Date.now()}`,
          quizId: 'daily-blitz',
          quizTitle: 'Ежедневный блиц-тест',
          score: finalScore,
          totalQuestions: todayQuestions.length,
          timeSpentSeconds: 120,
          date: todayStr,
          passed: finalScore >= 4
        };

        return {
          ...prev,
          dailyStreak: newStreak,
          lastActiveDate: todayStr,
          lastDailyBlitzDate: todayStr,
          dailyBlitzHistory: newHistory,
          quizResults: [newQuizResult, ...prev.quizResults]
        };
      });
    }
  };

  const getCategoryBadge = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('k8s') || c.includes('kubernetes')) {
      return { label: 'KUBERNETES', bg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/30' };
    } else if (c.includes('docker') || c.includes('container')) {
      return { label: 'DOCKER', bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30' };
    } else if (c.includes('cicd') || c.includes('ci/cd') || c.includes('gitops')) {
      return { label: 'CI/CD', bg: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30' };
    } else if (c.includes('linux') || c.includes('bash')) {
      return { label: 'LINUX', bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30' };
    } else if (c.includes('ansible') || c.includes('iac') || c.includes('terraform')) {
      return { label: 'IAC', bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30' };
    }
    return { label: cat.toUpperCase(), bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30' };
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-amber-50/20 dark:from-[#0d1424] dark:via-[#090d16] dark:to-[#121929] border border-amber-500/20 dark:border-amber-500/30 p-5 sm:p-6 shadow-lg shadow-amber-500/5 space-y-5 backdrop-blur-sm transition-all">
      
      {/* Background Decorative Mesh Lights */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-amber-500 dark:bg-amber-500/90 rounded-[10px] flex items-center justify-center text-slate-950">
                <Zap className="w-6 h-6 fill-slate-950" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white dark:border-[#0d1424]"></span>
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Ежедневный Блиц-Тест
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>5 вопросов • 2 мин</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Закрепите ключевые концепции DevOps и поддерживайте ваш ежедневный стрик
            </p>
          </div>
        </div>

        {/* Streak & Status Pill */}
        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center space-x-1.5 shadow-xs">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>Стрик: <strong>{progress.dailyStreak || 0} дн.</strong></span>
          </div>

          {isCompletedToday && mode === 'idle' && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Сегодня пройдено ({todayResult?.score}/{todayResult?.total})</span>
            </div>
          )}
        </div>
      </div>

      {/* IDLE STATE */}
      {mode === 'idle' && (
        <div className="bg-white/80 dark:bg-[#070b14]/70 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 rounded-xl space-y-4 relative z-10 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Подборка тем на сегодня ({new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}):</span>
              </div>

              {/* Topics Pills */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                {todayQuestions.map((q, i) => {
                  const badge = getCategoryBadge(q.category);
                  return (
                    <div
                      key={q.id || i}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border flex items-center space-x-1.5 ${badge.bg}`}
                    >
                      <span className="opacity-60 text-[10px]">#{i + 1}</span>
                      <span>{q.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartBlitz}
              className="w-full lg:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-md shadow-amber-500/25 flex items-center justify-center space-x-2.5 shrink-0 cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>{isCompletedToday ? 'Пройти блиц повторно' : 'Начать ежедневный блиц'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ STATE */}
      {mode === 'active' && currentQ && (
        <div className="space-y-4 relative z-10 bg-white/90 dark:bg-[#070b14]/80 border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-6 rounded-2xl animate-fadeIn backdrop-blur-md">
          
          {/* Progress Header & Stepper */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border uppercase ${getCategoryBadge(currentQ.category).bg}`}>
                  {currentQ.category}
                </span>
                <span className="text-slate-400">•</span>
                <span>Вопрос {currentIdx + 1} из {todayQuestions.length}</span>
              </div>

              <div className="flex items-center space-x-1 bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 rounded-lg text-amber-700 dark:text-amber-300 font-extrabold text-[11px] border border-amber-500/30">
                <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Счет: {score} / {todayQuestions.length}</span>
              </div>
            </div>

            {/* Stepper Dots & Progress Bar */}
            <div className="flex items-center space-x-1.5 pt-1">
              {todayQuestions.map((_, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCorrect = isAnswered && selectedAnswers[idx] === todayQuestions[idx].correctAnswerIndex;

                let dotColor = 'bg-slate-200 dark:bg-slate-800';
                if (isCurrent) dotColor = 'bg-amber-500 ring-2 ring-amber-500/40';
                else if (isAnswered) dotColor = isCorrect ? 'bg-emerald-500' : 'bg-rose-500';

                return (
                  <div
                    key={idx}
                    className={`h-2 rounded-full flex-1 transition-all duration-300 ${dotColor}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Question Title */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Code Snippet if present */}
          {currentQ.codeSnippet && (
            <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800/80 shadow-inner">
              <pre className="leading-relaxed"><code>{currentQ.codeSnippet}</code></pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {currentQ.options.map((optionText, optIdx) => {
              const userSelection = selectedAnswers[currentIdx];
              const isSelected = userSelection === optIdx;
              const isAnswered = userSelection !== undefined;
              const isCorrectOpt = optIdx === currentQ.correctAnswerIndex;

              let btnStyle = 'bg-slate-50/80 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500/60 hover:bg-white dark:hover:bg-[#121b2d] cursor-pointer';

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-500/60 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/10 border-rose-500/60 text-rose-900 dark:text-rose-200 font-bold shadow-xs';
                } else {
                  btnStyle = 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 text-slate-400 dark:text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-start space-x-3 group ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-[11px] font-black shrink-0 flex items-center justify-center transition-colors ${
                    isAnswered && isCorrectOpt ? 'bg-emerald-500 text-slate-950' :
                    isAnswered && isSelected ? 'bg-rose-500 text-white' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>

                  <span className="flex-1 leading-relaxed pt-0.5">{optionText}</span>

                  {isAnswered && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-transparent border border-emerald-500/30 text-slate-800 dark:text-slate-200 space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                <HelpCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Разбор ответа:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next / Complete Action Button */}
          {selectedAnswers[currentIdx] !== undefined && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2 cursor-pointer"
              >
                <span>{currentIdx < todayQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить блиц'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* SUMMARY RESULT STATE */}
      {mode === 'summary' && (
        <div className="space-y-5 relative z-10 bg-white/90 dark:bg-[#070b14]/80 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 rounded-2xl text-center animate-fadeIn backdrop-blur-md">
          
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Award className="w-8 h-8" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center border-2 border-white dark:border-[#070b14]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Ежедневный Блиц Завершен!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Ваш результат: <strong className="text-amber-600 dark:text-amber-400 font-black text-base">{score} из {todayQuestions.length}</strong> правильных ответов
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-500/25">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ежедневный стрик повышен до {progress.dailyStreak || 1} дн.!</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-black border border-amber-500/25">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>+{score * 20} XP Получено</span>
            </div>
          </div>

          <div className="pt-3 flex justify-center space-x-3">
            <button
              onClick={() => setMode('idle')}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              Вернуться на дашборд
            </button>
            <button
              onClick={handleStartBlitz}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Пройти повторно</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

