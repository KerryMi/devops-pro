import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuizResult, UserProgress, CategoryId } from '../../types';
import { QUIZZES } from '../../data/quizzes';
import { shuffleQuestionOptions } from '../../utils/quizUtils';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Check, 
  X,
  HelpCircle,
  Search,
  Star
} from 'lucide-react';

interface QuizViewProps {
  onSaveQuizResult: (result: QuizResult) => void;
  quizzes?: Quiz[];
  progress?: UserProgress;
  initialCategory?: CategoryId;
}

export const QuizView: React.FC<QuizViewProps> = ({ onSaveQuizResult, quizzes, progress, initialCategory }) => {
  const quizzesList = quizzes || QUIZZES;
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastEarnedXP, setLastEarnedXP] = useState<number>(0);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [initialCategory]);

  const filteredQuizzes = quizzesList.filter(quiz => {
    const matchesDifficulty = selectedDifficulty === 'All' || quiz.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory || quiz.category === 'all';
    
    const matchesSearch = !searchQuery.trim() || 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  // Scroll to top when opening quiz
  useEffect(() => {
    if (selectedQuiz) {
      window.scrollTo(0, 0);
    }
  }, [selectedQuiz]);

  // Start Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    const shuffledQuestions = quiz.questions.map(q => shuffleQuestionOptions(q));
    setSelectedQuiz({
      ...quiz,
      questions: shuffledQuestions,
    });
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setLastEarnedXP(0);
    setTimeLeftSeconds(quiz.timeLimitMinutes * 60);
  };

  // Timer Effect
  useEffect(() => {
    if (!selectedQuiz || isSubmitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedQuiz, isSubmitted, timeLeftSeconds]);

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz || isSubmitted) return;
    setIsSubmitted(true);

    let correctCount = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    let stars = 0;
    if (correctCount === 0) {
      stars = 0;
    } else if (correctCount === selectedQuiz.questions.length) {
      stars = 3;
    } else if (correctCount >= selectedQuiz.questions.length * 0.7) {
      stars = 2;
    } else {
      stars = 1;
    }

    const previousBestStars = (progress?.quizResults || [])
      .filter(r => r.quizId === selectedQuiz.id)
      .reduce((maxStars, r) => {
        let s = typeof r.stars === 'number' ? r.stars : 0;
        return Math.max(maxStars, s);
      }, 0);

    const baseXP = selectedQuiz.questions.length >= 25 ? 120 : selectedQuiz.questions.length >= 10 ? 70 : 40;
    let xpReward = 0;
    if (stars > previousBestStars) {
      if (stars === 3) xpReward = baseXP - (previousBestStars === 2 ? Math.round(baseXP * 0.65) : previousBestStars === 1 ? Math.round(baseXP * 0.35) : 0);
      else if (stars === 2) xpReward = Math.round(baseXP * 0.65) - (previousBestStars === 1 ? Math.round(baseXP * 0.35) : 0);
      else if (stars === 1) xpReward = Math.round(baseXP * 0.35);
    }

    setLastEarnedXP(xpReward);

    const result: QuizResult = {
      id: Date.now().toString(),
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      score: Math.round((correctCount / selectedQuiz.questions.length) * 100),
      totalQuestions: selectedQuiz.questions.length,
      timeSpentSeconds: selectedQuiz.timeLimitMinutes * 60 - timeLeftSeconds,
      date: new Date().toLocaleDateString('ru-RU'),
      passed: correctCount > 0,
      stars,
      xpReward
    };

    onSaveQuizResult(result);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  const questionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll active question into view
  useEffect(() => {
    if (questionRefs.current[currentQuestionIndex]) {
      questionRefs.current[currentQuestionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentQuestionIndex]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Quiz List View */}
      {!selectedQuiz ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span>Тесты</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Проверьте свои знания в условиях ограниченного времени. Подготовьтесь к техническому собеседованию.
                </p>
              </div>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all shrink-0 self-start sm:self-center cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Показать все темы (Текущая: {selectedCategory})</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                  Уровень:
                </span>
                {[
                  { label: 'Все уровни', value: 'All' },
                  { label: 'Junior', value: 'Junior' },
                  { label: 'Middle', value: 'Middle' },
                  { label: 'Senior', value: 'Senior' }
                ].map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedDifficulty === diff.value
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск по тестам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  По выбранным фильтрам тесты не найдены. Попробуйте сбросить фильтры.
                </p>
                <button
                  onClick={() => { setSelectedDifficulty('All'); setSelectedCategory('all'); setSearchQuery(''); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold cursor-pointer"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              filteredQuizzes.map((quiz) => {
                const isHardcore = quiz.questions.length >= 25;
                
                let diffBadgeClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                if (quiz.difficulty === 'Middle') {
                  diffBadgeClass = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
                } else if (quiz.difficulty === 'Senior') {
                  diffBadgeClass = isHardcore 
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' 
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
                }

                const quizResults = progress?.quizResults?.filter(r => r.quizId === quiz.id) || [];
                const bestResult = quizResults.reduce((best, curr) => {
                  const currCorrect = Math.round((curr.score / 100) * curr.totalQuestions);
                  let currStars = typeof curr.stars === 'number' ? curr.stars : 0;
                  if (typeof curr.stars !== 'number') {
                    if (currCorrect === 0) currStars = 0;
                    else if (currCorrect === curr.totalQuestions) currStars = 3;
                    else if (currCorrect >= curr.totalQuestions * 0.7) currStars = 2;
                    else currStars = 1;
                  }

                  if (!best) return { ...curr, stars: currStars };
                  
                  const bestCorrect = Math.round((best.score / 100) * best.totalQuestions);
                  let bestStars = typeof best.stars === 'number' ? best.stars : 0;
                  if (typeof best.stars !== 'number') {
                    if (bestCorrect === 0) bestStars = 0;
                    else if (bestCorrect === best.totalQuestions) bestStars = 3;
                    else if (bestCorrect >= best.totalQuestions * 0.7) bestStars = 2;
                    else bestStars = 1;
                  }

                  if (currStars > bestStars || (currStars === bestStars && curr.score > best.score)) {
                    return { ...curr, stars: currStars };
                  }
                  return best;
                }, null as any);

                return (
                  <div
                    key={quiz.id}
                    className={`p-6 rounded-2xl bg-white dark:bg-[#121927] border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md relative overflow-hidden ${
                      isHardcore 
                        ? 'border-amber-500/30 hover:border-amber-500/70 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 dark:to-transparent' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    {isHardcore && (
                      <div className="absolute top-0 right-0 px-3 py-0.5 rounded-bl-xl bg-slate-900 dark:bg-slate-800 text-amber-500 border-b border-l border-amber-500/30 text-[9px] font-black tracking-wider uppercase flex items-center space-x-1 shadow-xs">
                        <span>Марафон 30 вопросов</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${diffBadgeClass}`}>
                            {quiz.difficulty}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {quiz.questions.length} вопросов
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{quiz.timeLimitMinutes} мин</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      {bestResult ? (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Лучший результат</span>
                          <div className="flex items-center space-x-1.5">
                            <div className="flex items-center space-x-0.5">
                              {[1, 2, 3].map(num => (
                                <Star 
                                  key={num} 
                                  className={`w-3.5 h-3.5 ${num <= (bestResult.stars || 0) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300 dark:text-slate-700'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-mono">
                              {bestResult.score}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          {quiz.questions.length} вопросов • {quiz.timeLimitMinutes} мин
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className={`px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          isHardcore
                            ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-md shadow-rose-600/20'
                            : 'bg-emerald-600 hover:bg-emerald-500 shadow-xs'
                        }`}
                      >
                        <span>Начать тест</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Active Quiz Stage */
        <div className="space-y-6">
          
          {/* Top Stage Header */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                  {selectedQuiz.title}
                </h3>
              </div>

              {/* Right controls: Timer & Exit */}
              <div className="flex items-center gap-2 shrink-0">
                {!isSubmitted && (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(timeLeftSeconds)}</span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Выйти
                </button>
              </div>
            </div>

            {/* Bottom info row: full width, no awkward line breaks */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <span className="font-medium whitespace-nowrap">
                Вопрос {currentQuestionIndex + 1} из {selectedQuiz.questions.length}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                Отвечено: {answeredCount} из {selectedQuiz.questions.length}
              </span>
            </div>
          </div>

          {/* Interactive Question Bubbles Navigator */}
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-0.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                Навигация по вопросам:
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {answeredCount} из {selectedQuiz.questions.length} отвечено ({Math.round((answeredCount / selectedQuiz.questions.length) * 100)}%)
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / selectedQuiz.questions.length) * 100}%` }}
              />
            </div>

            {/* Single Row Horizontally Scrollable Track */}
            <div 
              ref={trackRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-1 scroll-smooth"
              style={{ scrollbarWidth: 'thin' }}
            >
              {selectedQuiz.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = userAnswers[idx] !== undefined;
                const isCorrect = isSubmitted && userAnswers[idx] === q.correctAnswerIndex;
                const isWrong = isSubmitted && isAnswered && !isCorrect;

                let bubbleClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700';

                if (isAnswered && !isSubmitted) {
                  bubbleClass = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold';
                }

                if (isCurrent) {
                  bubbleClass = 'bg-emerald-500 text-slate-950 font-black ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-[#121927] shadow-xs';
                }

                if (isSubmitted) {
                  if (isCorrect) {
                    bubbleClass = 'bg-emerald-500 text-slate-950 font-black';
                  } else if (isWrong) {
                    bubbleClass = 'bg-rose-500 text-white font-black';
                  } else {
                    bubbleClass = 'bg-slate-200 dark:bg-slate-800 text-slate-400';
                  }
                  if (isCurrent) {
                    bubbleClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-900';
                  }
                }

                return (
                  <button
                    key={idx}
                    ref={(el) => { questionRefs.current[idx] = el; }}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer shrink-0 select-none ${bubbleClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Card when Submitted */}
          {isSubmitted && (
            <div className="bg-emerald-500/10 border border-emerald-500/15 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-fadeIn">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                    Тест завершен
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Ваш результат: {(() => {
                    let correctCount = 0;
                    selectedQuiz.questions.forEach((q, idx) => {
                      if (userAnswers[idx] === q.correctAnswerIndex) {
                        correctCount++;
                      }
                    });
                    return correctCount;
                  })()} из {selectedQuiz.questions.length} правильных ({Math.round((Object.values(userAnswers).filter((ans, idx) => ans === selectedQuiz.questions[idx]?.correctAnswerIndex).length / selectedQuiz.questions.length) * 100)}%)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Вы можете переключаться по номерам вопросов выше, чтобы просмотреть свои ответы и подробный разбор каждого вопроса.
                </p>
              </div>

              <div className="flex items-center space-x-6 shrink-0 bg-white dark:bg-[#121927] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                {/* Stars Display */}
                <div className="text-center">
                  <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Получено звезд
                  </div>
                  <div className="flex items-center space-x-1 justify-center">
                    {[1, 2, 3].map((starNum) => {
                      let correctCount = 0;
                      selectedQuiz.questions.forEach((q, idx) => {
                        if (userAnswers[idx] === q.correctAnswerIndex) {
                          correctCount++;
                        }
                      });
                      let starsCount = 0;
                      if (correctCount === 0) starsCount = 0;
                      else if (correctCount === selectedQuiz.questions.length) starsCount = 3;
                      else if (correctCount >= selectedQuiz.questions.length * 0.7) starsCount = 2;
                      else starsCount = 1;

                      const isLit = starNum <= starsCount;
                      return (
                        <Star 
                          key={starNum} 
                          className={`w-4 h-4 transition-all duration-300 ${isLit ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300 dark:text-slate-700'}`} 
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />

                {/* XP Reward Display */}
                <div className="text-center">
                  <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Награда
                  </div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    +{lastEarnedXP} XP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question Card */}
          {selectedQuiz.questions[currentQuestionIndex] && (
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 uppercase tracking-wider">
                  {selectedQuiz.questions[currentQuestionIndex].category}
                </span>
              </div>

              {/* Option Choices */}
              <div className="space-y-3">
                {selectedQuiz.questions[currentQuestionIndex].options.map((optionText, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const isCorrect = selectedQuiz.questions[currentQuestionIndex].correctAnswerIndex === optIdx;

                  let styleClass = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-200 hover:border-emerald-500/50';

                  if (isSelected) {
                    styleClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      styleClass = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      styleClass = 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3 text-xs leading-relaxed ${styleClass}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isSubmitted ? (
                          isCorrect ? <Check className="w-4 h-4 text-emerald-500" /> : isSelected ? <X className="w-4 h-4 text-rose-500" /> : <div className="w-4 h-4 rounded-full border border-slate-400" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-400'}`} />
                        )}
                      </div>
                      <span>{optionText}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500">
                    <HelpCircle className="w-4 h-4" />
                    <span>Разбор ответа:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedQuiz.questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {/* Bottom Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                >
                  Предыдущий вопрос
                </button>

                {!isSubmitted ? (
                  currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      Завершить тест ({answeredCount}/{selectedQuiz.questions.length})
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Следующий вопрос
                    </button>
                  )
                ) : (
                  currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Следующий вопрос
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      Вернуться к списку тестов
                    </button>
                  )
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
