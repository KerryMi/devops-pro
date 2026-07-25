import React, { useState } from 'react';
import { Question, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  RotateCw, 
  Check, 
  X, 
  Brain, 
  Award, 
  ChevronRight, 
  Sparkles,
  Zap
} from 'lucide-react';

interface FlashcardsViewProps {
  questions: Question[];
  progress: UserProgress;
  onUpdateFlashcardBox: (questionId: string, newBox: number) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  questions,
  progress,
  onUpdateFlashcardBox,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter cards by category
  const activeQuestions = questions.filter(q => selectedCategory === 'all' || q.category === selectedCategory);
  const currentCard = activeQuestions[currentIndex];

  // Box statistics
  const boxesCount = [1, 2, 3, 4, 5].map(b => {
    return Object.values(progress.flashcardBoxes || {}).filter(val => val === b).length;
  });

  const handleNext = (rating: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    const currentBox = progress.flashcardBoxes[currentCard.id] || 1;
    let nextBox = currentBox;

    if (rating === 'hard') nextBox = 1; // Reset to box 1
    if (rating === 'good') nextBox = Math.min(5, currentBox);
    if (rating === 'easy') nextBox = Math.min(5, currentBox + 1);

    onUpdateFlashcardBox(currentCard.id, nextBox);
    setIsFlipped(false);

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop around
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Controls & Category Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              <span>Интервальное заучивание (Карточки)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Система коробок Лейтнера. Переворачивайте карточку и отмечайте уровень запоминания.
            </p>
          </div>

          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(Math.floor(Math.random() * activeQuestions.length));
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Перемешать</span>
          </button>
        </div>

        {/* Box Distribution Indicators */}
        <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          {[1, 2, 3, 4, 5].map((boxNum) => (
            <div key={boxNum} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Коробка {boxNum}</div>
              <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{boxesCount[boxNum - 1]}</div>
            </div>
          ))}
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-2">
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Все ({questions.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

      </div>

      {/* Main Flashcard Interactive Stage */}
      {currentCard ? (
        <div className="space-y-4">
          
          {/* Card Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
            <span>Карточка {currentIndex + 1} из {activeQuestions.length}</span>
            <span>Коробка {progress.flashcardBoxes[currentCard.id] || 1} из 5</span>
          </div>

          {/* Flip Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative min-h-[340px] rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 p-8 shadow-xl hover:shadow-2xl cursor-pointer transition-all flex flex-col justify-between group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isFlipped ? 'ОТВЕТ' : 'ВОПРОС'}</span>
            </div>

            <div className="my-auto space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                {CATEGORIES.find(c => c.id === currentCard.category)?.title} • {currentCard.difficulty}
              </span>

              {!isFlipped ? (
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {currentCard.title}
                </h3>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                    {currentCard.summaryAnswer}
                  </p>

                  {currentCard.codeSnippet && (
                    <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                      <code>{currentCard.codeSnippet.code}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{isFlipped ? 'Оцените ваш ответ ниже' : 'Нажмите на карточку, чтобы посмотреть ответ'}</span>
              <span className="font-semibold text-indigo-500 group-hover:underline">Клик = Перевернуть</span>
            </div>
          </div>

          {/* Action Rating Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-3 gap-3 animate-fadeIn pt-2">
              <button
                onClick={() => handleNext('hard')}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
                <span>Забыл (-1 Коробка)</span>
              </button>

              <button
                onClick={() => handleNext('good')}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
              >
                <Zap className="w-5 h-5" />
                <span>С трудом (Оставить)</span>
              </button>

              <button
                onClick={() => handleNext('easy')}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all shadow-sm"
              >
                <Check className="w-5 h-5" />
                <span>Знаю отлично! (+1)</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Award className="w-12 h-12 mx-auto text-amber-500 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Все карточки пройдены!</h3>
          <p className="text-xs text-slate-500 mt-1">Вы отлично поработали. Выберите другой раздел или сбросьте фильтры.</p>
        </div>
      )}

    </div>
  );
};
