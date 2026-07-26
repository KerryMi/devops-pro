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
  Play
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

  return (
    <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden space-y-5">
      
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <Zap className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Ежедневный Блиц-Тест
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                5 вопросов
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Быстрая прокачка знаний за 2 минуты в день для поддержания мотивации и стрика
            </p>
          </div>
        </div>

        {isCompletedToday && mode === 'idle' && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center space-x-1.5 shrink-0 self-start sm:self-auto">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Пройдено</span>
          </div>
        )}
      </div>

      {/* IDLE STATE */}
      {mode === 'idle' && (
        <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full px-0">
            <div className="space-y-1.5 max-w-full overflow-hidden w-full px-0">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-full px-0">
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Блиц-подборка на сегодня ({new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}):</span>
              </div>
              <div 
                style={{ width: '100%', paddingLeft: 0, paddingRight: 0, overflowX: 'auto' }} 
                className="flex flex-row whitespace-nowrap scrollbar-none gap-1.5 pt-1 pb-1 max-w-full snap-x snap-mandatory w-full"
              >
                {todayQuestions.map((q, i) => {
                  const cat = q.category.toLowerCase();
                  let colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                  if (cat.includes('k8s') || cat.includes('kubernetes')) {
                    colorClasses = 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20';
                  } else if (cat.includes('docker') || cat.includes('container')) {
                    colorClasses = 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
                  } else if (cat.includes('cicd') || cat.includes('ci/cd') || cat.includes('gitops')) {
                    colorClasses = 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
                  } else if (cat.includes('linux') || cat.includes('bash')) {
                    colorClasses = 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
                  } else if (cat.includes('ansible') || cat.includes('iac') || cat.includes('terraform')) {
                    colorClasses = 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20';
                  }
                  
                  return (
                    <span
                      key={q.id}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shrink-0 snap-start ${colorClasses}`}
                    >
                      #{i + 1} {q.category.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            </div>
 
            <button
              onClick={handleStartBlitz}
              className="w-full md:w-auto px-5 py-2.5 rounded-[12px] bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-500/25 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isCompletedToday ? 'Пройти снова' : 'Начать блиц-тест'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ STATE */}
      {mode === 'active' && currentQ && (
        <div className="space-y-4 relative z-10 bg-slate-50/80 dark:bg-[#0b1120]/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl animate-fadeIn">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase text-[10px]">
                {currentQ.category}
              </span>
              <span>Вопрос {currentIdx + 1} из {todayQuestions.length}</span>
            </div>

            <span>Текущий счет: {score}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIdx + 1) / todayQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug pt-1">
            {currentQ.question}
          </h3>

          {/* Code Snippet if present */}
          {currentQ.codeSnippet && (
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre><code>{currentQ.codeSnippet}</code></pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {currentQ.options.map((optionText, optIdx) => {
              const userSelection = selectedAnswers[currentIdx];
              const isSelected = userSelection === optIdx;
              const isAnswered = userSelection !== undefined;
              const isCorrectOpt = optIdx === currentQ.correctAnswerIndex;

              let btnStyle = 'bg-white dark:bg-[#121927] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500';

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-800 dark:text-rose-300 font-bold';
                } else {
                  btnStyle = 'bg-white/40 dark:bg-[#121927]/40 border-slate-200/40 dark:border-slate-800/40 opacity-50';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`p-3 sm:p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start space-x-3 ${btnStyle}`}
                >
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                    isAnswered && isCorrectOpt ? 'bg-emerald-500 text-white' :
                    isAnswered && isSelected ? 'bg-rose-500 text-white' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-snug">{optionText}</span>
                  {isAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-800/50 space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Объяснение:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Button */}
          {selectedAnswers[currentIdx] !== undefined && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 shadow-md shadow-emerald-500/20"
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
        <div className="space-y-4 relative z-10 bg-slate-50/80 dark:bg-[#0b1120]/60 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-center animate-fadeIn space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mx-auto flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Блиц-тест завершен!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ваш результат: <strong className="text-slate-900 dark:text-white font-extrabold text-sm">{score} из {todayQuestions.length}</strong> правильных ответов
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-500/20">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Ежедневный стрик поддержан!</span>
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => setMode('idle')}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
            >
              Закрыть
            </button>
            <button
              onClick={handleStartBlitz}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Пройти повторно</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
