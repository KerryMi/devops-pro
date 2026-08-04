import React, { useState, useMemo } from 'react';
import { QuizQuestion, UserProgress } from '../../types';
import { QUIZZES } from '../../data/quizzes';
import { shuffleQuestionOptions } from '../../utils/quizUtils';
import { 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle,
  Play,
  BarChart2,
  Calendar,
  ChevronRight,
  Lock,
  Clock
} from 'lucide-react';

interface DailyBlitzSectionProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

// Extract all quiz questions from QUIZZES with explicit difficulty
const ALL_QUIZ_QUESTIONS: QuizQuestion[] = QUIZZES.flatMap(quiz => {
  return quiz.questions.map(q => {
    let diff: 'Junior' | 'Middle' | 'Senior' = 'Middle';
    if (q.difficulty) {
      diff = q.difficulty;
    } else if (quiz.difficulty === 'Junior' || quiz.difficulty === 'Middle' || quiz.difficulty === 'Senior') {
      diff = quiz.difficulty;
    } else {
      diff = q.id.includes('junior') ? 'Junior' : (q.id.includes('senior') || q.id.includes('hard') ? 'Senior' : 'Middle');
    }
    return {
      ...q,
      difficulty: diff
    };
  });
});

// FNV-1a Hash function for date string
function hashString(str: string): number {
  let h = 2166136261 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

// Mulberry32 PRNG for uniform random distribution
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getPreviousDateStr(dateStr: string, daysAgo: number = 1): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function generateRawDailyQuestions(dateStr: string): QuizQuestion[] {
  const seed = hashString(dateStr);
  const rng = mulberry32(seed);

  const juniorPool = ALL_QUIZ_QUESTIONS.filter(q => q.difficulty === 'Junior');
  const middlePool = ALL_QUIZ_QUESTIONS.filter(q => q.difficulty === 'Middle');
  const seniorPool = ALL_QUIZ_QUESTIONS.filter(q => q.difficulty === 'Senior');

  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffledJunior = shuffle(juniorPool);
  const shuffledMiddle = shuffle(middlePool);
  const shuffledSenior = shuffle(seniorPool);

  const pattern = Math.floor(rng() * 3);
  let jCount = 2, mCount = 2, sCount = 1;
  if (pattern === 1) { jCount = 1; mCount = 2; sCount = 2; }
  else if (pattern === 2) { jCount = 2; mCount = 1; sCount = 2; }

  const selected = [
    ...shuffledJunior.slice(0, jCount),
    ...shuffledMiddle.slice(0, mCount),
    ...shuffledSenior.slice(0, sCount)
  ];

  return shuffle(selected).slice(0, 5);
}

function getDailyQuestions(dateStr: string): QuizQuestion[] {
  const prevDate1 = getPreviousDateStr(dateStr, 1);
  const prevDate2 = getPreviousDateStr(dateStr, 2);

  const usedIds = new Set<string>();
  generateRawDailyQuestions(prevDate1).forEach(q => usedIds.add(q.id));
  generateRawDailyQuestions(prevDate2).forEach(q => usedIds.add(q.id));

  const seed = hashString(dateStr + '-salt-v2');
  const rng = mulberry32(seed);

  const filterPool = (pool: QuizQuestion[]) => {
    const fresh = pool.filter(q => !usedIds.has(q.id));
    return fresh.length >= 2 ? fresh : pool;
  };

  const juniorPool = filterPool(ALL_QUIZ_QUESTIONS.filter(q => q.difficulty === 'Junior'));
  const middlePool = filterPool(ALL_QUIZ_QUESTIONS.filter(q => q.difficulty === 'Middle'));
  const seniorPool = filterPool(ALL_QUIZ_QUESTIONS.filter(q => q.difficulty === 'Senior'));

  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffledJunior = shuffle(juniorPool);
  const shuffledMiddle = shuffle(middlePool);
  const shuffledSenior = shuffle(seniorPool);

  const pattern = Math.floor(rng() * 3);
  let jCount = 2, mCount = 2, sCount = 1;
  if (pattern === 1) { jCount = 1; mCount = 2; sCount = 2; }
  else if (pattern === 2) { jCount = 2; mCount = 1; sCount = 2; }

  const selected = [
    ...shuffledJunior.slice(0, jCount),
    ...shuffledMiddle.slice(0, mCount),
    ...shuffledSenior.slice(0, sCount)
  ];

  return shuffle(selected).slice(0, 5);
}

export const DailyBlitzSection: React.FC<DailyBlitzSectionProps> = ({
  progress,
  onUpdateProgress
}) => {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayQuestions = useMemo(() => {
    return getDailyQuestions(todayStr).map(q => shuffleQuestionOptions(q));
  }, [todayStr]);

  const todayResult = progress.dailyBlitzHistory?.[todayStr];
  const isCompletedToday = Boolean(todayResult);

  const difficultyCounts = useMemo(() => {
    const counts = { Junior: 0, Middle: 0, Senior: 0 };
    todayQuestions.forEach(q => {
      if (q.difficulty && counts[q.difficulty] !== undefined) {
        counts[q.difficulty]++;
      } else {
        counts.Middle++;
      }
    });
    return counts;
  }, [todayQuestions]);

  const [mode, setMode] = useState<'idle' | 'active' | 'summary'>('idle');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffSecs = Math.max(0, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));

      const hours = Math.floor(diffSecs / 3600);
      const minutes = Math.floor((diffSecs % 3600) / 60);
      const seconds = diffSecs % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTimer = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;



  const currentQ = todayQuestions[currentIdx];

  const handleStartBlitz = () => {
    if (isCompletedToday) return; // Block starting if already completed today
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

      // Update User Progress safely (only once per day)
      onUpdateProgress(prev => {
        if (prev.dailyBlitzHistory?.[todayStr]) {
          return prev; // Already recorded today, prevent double XP/streak
        }

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
          score: Math.round((finalScore / todayQuestions.length) * 100),
          totalQuestions: todayQuestions.length,
          timeSpentSeconds: 120,
          date: todayStr,
          passed: finalScore >= 4,
          stars: finalScore === 5 ? 3 : (finalScore === 4 || finalScore === 3 ? 2 : (finalScore === 0 ? 0 : 1)),
          xpReward: finalScore * 20
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
      return { label: 'KUBERNETES', bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-300' };
    } else if (c.includes('docker') || c.includes('container')) {
      return { label: 'DOCKER', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-300' };
    } else if (c.includes('cicd') || c.includes('ci/cd') || c.includes('gitops')) {
      return { label: 'CI/CD', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-300' };
    } else if (c.includes('linux') || c.includes('bash')) {
      return { label: 'LINUX', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-300' };
    } else if (c.includes('ansible') || c.includes('iac') || c.includes('terraform')) {
      return { label: 'IAC', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-300' };
    }
    return { label: cat.toUpperCase(), bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' };
  };

  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case 'Junior':
        return { label: 'JUNIOR', bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' };
      case 'Senior':
        return { label: 'SENIOR', bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300' };
      case 'Middle':
      default:
        return { label: 'MIDDLE', bg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300' };
    }
  };

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl bg-white dark:bg-[#121927] p-5 shadow-xs gap-4 transition-all">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-amber-500" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Ежедневный Блиц
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>5 вопросов</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
              Закрепите ключевые концепции DevOps и держите стрик
            </p>
          </div>
        </div>

        {/* Streak & Status Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
          <div className="px-2 py-1 sm:px-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] sm:text-xs font-bold flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
            <span>Стрик: <strong>{progress.dailyStreak || 0} дн.</strong></span>
          </div>

          {isCompletedToday && mode === 'idle' && (
            <div className="px-2 py-1 sm:px-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-extrabold flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Сдан ({todayResult?.score}/{todayResult?.total})</span>
            </div>
          )}

          {mode === 'idle' && (
            <div className="px-2 py-1 sm:px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-mono text-[10px] sm:text-[11px] font-extrabold flex items-center space-x-1 shrink-0">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span>{formattedTimer}</span>
            </div>
          )}
        </div>
      </div>

      {/* IDLE STATE */}
      {mode === 'idle' && (
        <div className="flex-1 bg-slate-50 dark:bg-[#0b1120] p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-3 sm:gap-4 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 flex-wrap gap-1">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Темы дня ({new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}):</span>
              </div>
            </div>

            {/* Topics Pills */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {todayQuestions.map((q, i) => {
                const catBadge = getCategoryBadge(q.category);
                return (
                  <div
                    key={q.id || i}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-extrabold flex items-center space-x-1 sm:space-x-1.5 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0"
                  >
                    <span className="opacity-60 text-[8px] sm:text-[9px] font-mono">#{i + 1}</span>
                    <span className={`px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase ${catBadge.bg}`}>
                      {q.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Only Extra Info: Reward & Question Composition */}
          <div className="hidden md:grid grid-cols-2 gap-3 my-auto">
            <div className="p-3 rounded-xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
                  Награда за блиц
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  +50 XP и стрик
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
                  Состав вопросов
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {difficultyCounts.Junior} Junior • {difficultyCounts.Middle} Middle • {difficultyCounts.Senior} Senior
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button / Disabled State */}
          <div className="pt-1">
            {isCompletedToday ? (
              <button
                type="button"
                disabled
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center space-x-1.5 cursor-not-allowed border border-emerald-500/20"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Пройдено сегодня ({todayResult?.score}/{todayResult?.total})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartBlitz}
                className="w-full px-5 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wide transition-colors flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Начать ежедневный блиц</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ STATE */}
      {mode === 'active' && currentQ && (
        <div className="space-y-4 bg-slate-50 dark:bg-[#0b1120] p-4 sm:p-5 rounded-xl">
          
          {/* Progress Header & Stepper */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${getCategoryBadge(currentQ.category).bg}`}>
                  {currentQ.category}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${getDifficultyBadge(currentQ.difficulty).bg}`}>
                  {currentQ.difficulty || 'Middle'}
                </span>
                <span className="text-slate-400">•</span>
                <span>Вопрос {currentIdx + 1} из {todayQuestions.length}</span>
              </div>

              <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-extrabold text-[11px]">
                <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Счет: {score} / {todayQuestions.length}</span>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center space-x-1.5 pt-1">
              {todayQuestions.map((_, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCorrect = isAnswered && selectedAnswers[idx] === todayQuestions[idx].correctAnswerIndex;

                let dotColor = 'bg-slate-200 dark:bg-slate-800';
                if (isCurrent) dotColor = 'bg-amber-500';
                else if (isAnswered) dotColor = isCorrect ? 'bg-emerald-500' : 'bg-rose-500';

                return (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full flex-1 transition-colors ${dotColor}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Question Title */}
          <div className="pt-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Code Snippet if present */}
          {currentQ.codeSnippet && (
            <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
              <pre className="leading-relaxed"><code>{currentQ.codeSnippet}</code></pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            {currentQ.options.map((optionText, optIdx) => {
              const userSelection = selectedAnswers[currentIdx];
              const isSelected = userSelection === optIdx;
              const isAnswered = userSelection !== undefined;
              const isCorrectOpt = optIdx === currentQ.correctAnswerIndex;

              let btnStyle = 'bg-white dark:bg-[#121927] text-slate-800 dark:text-slate-200 hover:bg-amber-500/10 cursor-pointer';

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/10 text-rose-900 dark:text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-white/40 dark:bg-[#121927]/40 text-slate-400 dark:text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  type="button"
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`p-3 rounded-xl text-left text-xs sm:text-sm transition-colors flex items-start space-x-2.5 ${btnStyle}`}
                >
                  <span className={`w-5 h-5 rounded text-[10px] font-black shrink-0 flex items-center justify-center ${
                    isAnswered && isCorrectOpt ? 'bg-emerald-500 text-slate-950' :
                    isAnswered && isSelected ? 'bg-rose-500 text-white' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>

                  <span className="flex-1 leading-relaxed pt-0.5">{optionText}</span>

                  {isAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-slate-800 dark:text-slate-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                <HelpCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Разбор ответа:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next / Complete Action Button */}
          {selectedAnswers[currentIdx] !== undefined && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center space-x-2 cursor-pointer"
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
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-5 my-auto bg-slate-50/50 dark:bg-[#0b1120]/40 rounded-xl">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {score}/{todayQuestions.length} верных
            </h3>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
              +{score * 20} XP
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode('idle')}
            className="px-8 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs"
          >
            ОК
          </button>
        </div>
      )}

    </div>
  );
};
