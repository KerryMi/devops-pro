import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuizResult } from '../types';
import { QUIZZES } from '../data/quizzes';
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
}

export const QuizView: React.FC<QuizViewProps> = ({ onSaveQuizResult }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

  // Start Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
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

    const result: QuizResult = {
      id: Date.now().toString(),
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      score: Math.round((correctCount / selectedQuiz.questions.length) * 100),
      totalQuestions: selectedQuiz.questions.length,
      timeSpentSeconds: selectedQuiz.timeLimitMinutes * 60 - timeLeftSeconds,
      date: new Date().toLocaleDateString('ru-RU'),
      passed: (correctCount / selectedQuiz.questions.length) >= 0.7
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
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>Тесты и Эмуляция Собеседования</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Проверьте свои знания в условиях ограниченного времени. Выберите нужный модуль ниже.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUIZZES.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
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
                  <span className="text-xs text-slate-400 font-medium">Вопросов: {quiz.questions.length}</span>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 transition-all"
                  >
                    <span>Пройти тест</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
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
