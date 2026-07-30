import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuizResult, UserProgress, CategoryId } from '../types';
import { QUIZZES } from '../data/quizzes';
import { shuffleQuestionOptions } from '../utils/quizUtils';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  X,
  HelpCircle
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
    return matchesDifficulty && matchesCategory;
  });

  // Scroll to top when opening/closing quiz or changing questions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedQuiz, currentQuestionIndex]);

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

    let xpReward = 0;
    if (stars > previousBestStars) {
      if (stars === 3) xpReward = 60 - (previousBestStars === 2 ? 40 : previousBestStars === 1 ? 20 : 0);
      else if (stars === 2) xpReward = 40 - (previousBestStars === 1 ? 20 : 0);
      else if (stars === 1) xpReward = 20;
    }

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Quiz List View */}
      {!selectedQuiz ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span>Тесты</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Проверьте свои знания в условиях ограниченного времени. Подготовьтесь к техническому интервью.
                </p>
              </div>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all shrink-0 self-start sm:self-center"
                >
                  Показать все темы (Текущая: {selectedCategory}) ✕
                </button>
              )}
            </div>

            {/* Difficulty Pills */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto pb-1">
              {[
                { label: 'Все уровни', value: 'All' },
                { label: 'Junior', value: 'Junior' },
                { label: 'Middle', value: 'Middle' },
                { label: 'Senior', value: 'Senior' }
              ].map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDifficulty === diff.value
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  По выбранным фильтрам тесты не найдены. Попробуйте сбросить фильтры.
                </p>
                <button
                  onClick={() => { setSelectedDifficulty('All'); setSelectedCategory('all'); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              filteredQuizzes.map((quiz) => {
                let diffBadgeClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                if (quiz.difficulty === 'Middle') {
                  diffBadgeClass = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
                } else if (quiz.difficulty === 'Senior') {
                  diffBadgeClass = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
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
                    className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${diffBadgeClass}`}>
                          {quiz.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{quiz.timeLimitMinutes} мин</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      {bestResult ? (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Лучший результат</span>
                          <div className="flex items-center space-x-1.5">
                            <div className="flex items-center">
                              {[1, 2, 3].map(num => (
                                <span key={num} className={`text-xs leading-none ${num <= (bestResult.stars || 0) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-800'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-mono">
                              {bestResult.score}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Вопросов: {quiz.questions.length}</span>
                      )}
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <span>Пройти тест</span>
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
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {selectedQuiz.title}
              </h3>
              <p className="text-xs text-slate-400">
                Вопрос {currentQuestionIndex + 1} из {selectedQuiz.questions.length}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {!isSubmitted && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold font-mono">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>{formatTime(timeLeftSeconds)}</span>
                </div>
              )}

              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Выйти
              </button>
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
                  })()} из {selectedQuiz.questions.length} правильных
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Вы можете просмотреть свои ответы и подробные разборы по каждому вопросу ниже.
                </p>
              </div>

              <div className="flex items-center space-x-6 shrink-0 bg-white dark:bg-[#121927] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                {/* Stars Display */}
                <div className="text-center">
                  <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Получено звезд
                  </div>
                  <div className="flex items-center space-x-0.5 justify-center">
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
                        <span key={starNum} className={`text-xl leading-none transition-all duration-300 ${isLit ? 'text-amber-400' : 'text-slate-200 dark:text-slate-800'}`}>
                          ★
                        </span>
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
                    +{(() => {
                      let correctCount = 0;
                      selectedQuiz.questions.forEach((q, idx) => {
                        if (userAnswers[idx] === q.correctAnswerIndex) {
                          correctCount++;
                        }
                      });
                      let starsCount = 0;
                      if (correctCount === selectedQuiz.questions.length) starsCount = 3;
                      
                      const alreadyMaxed = (progress?.quizResults || []).some(r => 
                        r.quizId === selectedQuiz.id && 
                        Math.round((r.score / 100) * r.totalQuestions) === r.totalQuestions
                      );

                      if (starsCount === 3 && !alreadyMaxed) return 150;
                      return 0;
                    })()} XP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question Card */}
          {selectedQuiz.questions[currentQuestionIndex] && (
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedQuiz.questions[currentQuestionIndex].question}
              </h3>

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
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
                >
                  Назад
                </button>

                {!isSubmitted ? (
                  currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                    >
                      Завершить тест
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Следующий вопрос
                    </button>
                  )
                ) : (
                  currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Далее →
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
                    >
                      Вернуться к тестам
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
