import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { Question, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  RotateCw, 
  Check, 
  X, 
  Brain, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Keyboard,
  Timer,
  BookOpen,
  AlertTriangle,
  Copy,
  Info,
  Flame,
  TrendingUp,
  Sliders,
  Filter,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

// Custom dynamic icon lookup helper for categories
const renderCategoryIcon = (iconName: string, className: string = "w-5 h-5") => {
  switch (iconName) {
    case 'Box': return <BoxIcon className={className} />;
    case 'Layers': return <LayersIcon className={className} />;
    case 'Terminal': return <TerminalIcon className={className} />;
    case 'GitBranch': return <GitBranchIcon className={className} />;
    case 'Cpu': return <CpuIcon className={className} />;
    case 'Activity': return <ActivityIcon className={className} />;
    case 'Globe': return <GlobeIcon className={className} />;
    case 'Cloud': return <CloudIcon className={className} />;
    case 'Settings': return <SettingsIcon className={className} />;
    case 'Server': return <ServerIcon className={className} />;
    default: return <BoxIcon className={className} />;
  }
};

// Internal custom mini SVGs to prevent missing imports for the exact category names
const BoxIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const LayersIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const TerminalIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GitBranchIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7a3 3 0 100-6 3 3 0 000 6zM8 7V7m0 0v10m0 0a3 3 0 100 6 3 3 0 000-6zm0 0h6m-3-5a3 3 0 106 0 3 3 0 00-6 0z" /></svg>;
const CpuIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const ActivityIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" /></svg>;
const GlobeIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
const CloudIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const SettingsIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ServerIcon = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;

// Simple custom Markdown formatter for robust formatting
const renderTextWithMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;
  return (
    <div className="select-text inline-block w-full text-left font-medium">
      <Markdown
        components={{
          p: ({node, ...props}) => <span className="inline" {...props} />,
          strong: ({node, ...props}) => <strong className="font-extrabold text-slate-900 dark:text-white" {...props} />,
          em: ({node, ...props}) => <em className="italic text-slate-800 dark:text-slate-200" {...props} />,
          code: ({node, ...props}) => <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-500 dark:text-rose-400 font-mono text-xs font-semibold" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-1.5 space-y-1 marker:text-emerald-500 text-left" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-1.5 space-y-1 marker:text-emerald-500 text-left" {...props} />,
          li: ({node, ...props}) => <li className="pl-0.5 text-left" {...props} />,
        }}
      >
        {text}
      </Markdown>
    </div>
  );
};

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
  // Filters & State
  const studyStageRef = useRef<HTMLDivElement>(null);

  const scrollToStudyStage = () => {
    studyStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<'all' | number>('all');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Interactive Accordions inside Card back
  const [showTips, setShowTips] = useState(false);
  const [showPitfalls, setShowPitfalls] = useState(false);

  // Session stats & gamification
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Success Feedback Toast / Reset States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Session Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 2. Base filter of questions by category
  const activeQuestions = questions.filter(
    q => selectedCategory === 'all' || q.category === selectedCategory
  );

  // 3. Dynamic Leitner Box counts based on category filter
  const boxesCount = [1, 2, 3, 4, 5].map(b => {
    return activeQuestions.filter(q => {
      const box = progress.flashcardBoxes?.[q.id] || 1;
      return box === b;
    }).length;
  });

  // 4. Combined Filter: category + Leitner box + difficulty level
  const filteredQuestions = activeQuestions.filter(q => {
    // Leitner Box Filter
    if (selectedBoxFilter !== 'all') {
      const box = progress.flashcardBoxes?.[q.id] || 1;
      if (box !== selectedBoxFilter) return false;
    }
    // Difficulty Filter
    if (selectedDifficulty !== 'all') {
      if (q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    }
    return true;
  });

  // 5. Shuffle Handling
  useEffect(() => {
    if (isShuffled) {
      // Create random sequence of indices
      const indices = Array.from({ length: filteredQuestions.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledOrder(indices);
    } else {
      setShuffledOrder([]);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowTips(false);
    setShowPitfalls(false);
  }, [isShuffled, selectedCategory, selectedDifficulty, selectedBoxFilter, filteredQuestions.length]);

  // Map the current index to shuffled mapping if enabled
  const getMappedIndex = (idx: number) => {
    if (isShuffled && shuffledOrder.length === filteredQuestions.length && shuffledOrder[idx] !== undefined) {
      return shuffledOrder[idx];
    }
    return idx;
  };

  const currentCard = filteredQuestions[getMappedIndex(currentIndex)];

  // Reset indices on bounds error
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  // 6. Navigation Controls
  const handlePrev = () => {
    if (filteredQuestions.length === 0) return;
    setIsFlipped(false);
    setShowTips(false);
    setShowPitfalls(false);
    stopSpeaking();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredQuestions.length - 1));
  };

  const handleNextCardOnly = () => {
    if (filteredQuestions.length === 0) return;
    setIsFlipped(false);
    setShowTips(false);
    setShowPitfalls(false);
    stopSpeaking();
    setCurrentIndex(prev => (prev < filteredQuestions.length - 1 ? prev + 1 : 0));
  };

  // Leitner Grade Evaluation Handler
  const handleNext = (rating: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    // Track statistics
    setSessionReviewed(prev => prev + 1);
    if (rating === 'easy' || rating === 'good') {
      setSessionCorrect(prev => prev + 1);
      setCurrentStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      setCurrentStreak(0);
    }

    const currentBox = progress.flashcardBoxes[currentCard.id] || 1;
    let nextBox = currentBox;

    if (rating === 'hard') {
      nextBox = 1; // Reset to box 1
    } else if (rating === 'good') {
      nextBox = currentBox; // Keep the same box
    } else if (rating === 'easy') {
      nextBox = Math.min(5, currentBox + 1); // Upgrade box
    }

    onUpdateFlashcardBox(currentCard.id, nextBox);
    setIsFlipped(false);
    setShowTips(false);
    setShowPitfalls(false);
    stopSpeaking();

    // Advance to next card
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // 7. Text-to-Speech API integration
  const startSpeaking = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Rough language detection
    const hasCyrillic = /[а-яА-Я]/.test(text);
    utterance.lang = hasCyrillic ? 'ru-RU' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleSpeaking = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid flipping card
    if (isSpeaking) {
      stopSpeaking();
    } else {
      if (!currentCard) return;
      const textToSpeak = isFlipped 
        ? `${currentCard.title}. Ответ: ${currentCard.summaryAnswer}`
        : `${currentCard.title}. Подумайте над ответом и переверните карточку.`;
      startSpeaking(textToSpeak);
    }
  };

  // Stop speaking when moving between states
  useEffect(() => {
    stopSpeaking();
  }, [currentIndex, isFlipped]);

  // 8. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (key === 'arrowright' || key === 'd' || key === 'в') {
        handleNextCardOnly();
      } else if (key === 'arrowleft' || key === 'a' || key === 'ф') {
        handlePrev();
      } else if (isFlipped) {
        if (key === '1') {
          handleNext('hard');
        } else if (key === '2') {
          handleNext('good');
        } else if (key === '3') {
          handleNext('easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, filteredQuestions.length]);

  // 9. Code copy utility
  const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 10. Leitner box Reset progression handler
  const handleResetProgress = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    } else {
      // Execute reset for ALL matching active filters
      const targetQuestions = filteredQuestions.length > 0 ? filteredQuestions : activeQuestions;
      targetQuestions.forEach(q => {
        onUpdateFlashcardBox(q.id, 1);
      });
      setResetConfirm(false);
      setSuccessMessage(`Прогресс сброшен до Коробки 1 для ${targetQuestions.length} карт!`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedBoxFilter('all');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Calculate Box 5 percentage out of total questions
  const totalInFilter = filteredQuestions.length;
  const box5InFilter = filteredQuestions.filter(q => (progress.flashcardBoxes?.[q.id] || 1) === 5).length;
  const masteryPercentage = totalInFilter > 0 ? Math.round((box5InFilter / totalInFilter) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 px-4 animate-fadeIn">
      
      {/* Toast Feedback */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-semibold animate-mobileSlideUp">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TOP ROW BENTO GRID - STATS, LOGO, INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BENTO TILE 1: Leitner Master Progress & Quick Start (Full Left banner) */}
        <div className="bento-card lg:col-span-8 flex flex-col justify-between space-y-6 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 mr-1" />
                <span>Лейтнер</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2 mt-1">
                <span>Интервальное заучивание</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Карточки автоматически перемещаются между коробками по мере запоминания. Коробка 5 — это полное освоение!
              </p>
              <div className="pt-2">
                <button
                  onClick={scrollToStudyStage}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/15 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Начать изучение карточек</span>
                </button>
              </div>
            </div>

            {/* Overall stats progress badge */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2.5 rounded-2xl flex items-center space-x-3 self-start">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Освоено в выборке</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{box5InFilter} / {totalInFilter} <span className="text-xs font-normal text-slate-400">({masteryPercentage}%)</span></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm border border-emerald-500/20">
                {masteryPercentage}%
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
              <span>Доля проработанных карт</span>
              <span>{masteryPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
              <div 
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>

          {/* INTERACTIVE LEITNER BOX CHIPS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Фильтр по коробкам Лейтнера</span>
              </span>
              {selectedBoxFilter !== 'all' && (
                <button 
                  onClick={() => setSelectedBoxFilter('all')}
                  className="text-xs text-emerald-500 hover:underline font-bold"
                >
                  Сбросить фильтр коробок
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {[1, 2, 3, 4, 5].map((boxNum) => {
                const isActive = selectedBoxFilter === boxNum;
                const count = boxesCount[boxNum - 1];
                
                // Color configuration per box
                const boxColors = [
                  { border: 'hover:border-rose-500/40', active: 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400' },
                  { border: 'hover:border-amber-500/40', active: 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400' },
                  { border: 'hover:border-blue-500/40', active: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' },
                  { border: 'hover:border-indigo-500/40', active: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400' },
                  { border: 'hover:border-emerald-500/40', active: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' },
                ];

                const currentStyle = boxColors[boxNum - 1];

                return (
                  <button
                    key={boxNum}
                    onClick={() => setSelectedBoxFilter(isActive ? 'all' : boxNum)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? `${currentStyle.active} border-2 shadow-sm`
                        : `border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 ${currentStyle.border}`
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Коробка {boxNum}</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                        {count}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">карт</span>
                    </div>
                    {/* Tiny visual guide */}
                    <div className="text-[9px] text-slate-400 mt-1.5 border-t border-slate-200/50 dark:border-slate-800/50 pt-1 truncate">
                      {boxNum === 1 ? 'Каждый день' : boxNum === 2 ? 'Раз в 2 дня' : boxNum === 3 ? 'Раз в неделю' : boxNum === 4 ? 'Раз в 2 нед.' : 'Освоено'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* BENTO TILE 2: Live Session Statistics Dashboard (Right card) */}
        <div className="bento-card lg:col-span-4 flex flex-col justify-between space-y-4 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Timer className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Текущая Сессия</span>
            </span>
            <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono text-sm font-extrabold flex items-center space-x-1">
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Answered Stat */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Оценено карт</div>
              <div className="text-2xl font-black text-slate-950 dark:text-white mt-1 flex items-baseline">
                <span>{sessionReviewed}</span>
              </div>
            </div>

            {/* Accuracy Rate */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>Успешность</span>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {sessionReviewed > 0 
                  ? `${Math.round((sessionCorrect / sessionReviewed) * 100)}%` 
                  : '—'}
              </div>
            </div>

            {/* Streak Stat */}
            <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100/60 dark:border-amber-900/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
                  <span>Серия ответов</span>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Без ошибок подряд
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-orange-600 dark:text-orange-400">
                  {currentStreak}
                </div>
                <div className="text-[9px] text-slate-400">Макс: {maxStreak}</div>
              </div>
            </div>

          </div>

          <div className="text-[11px] text-slate-400 text-center italic bg-slate-50/50 dark:bg-slate-900/40 p-2 rounded-xl">
            Совет: используйте быстрые клавиши на ПК для мгновенной оценки!
          </div>

        </div>

      </div>

      {/* MAIN TWO-COLUMN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: FILTERS, CATEGORIES, CONFIGS (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* BENTO CARD: Directory & Category Selector */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <span>Разделы знаний</span>
            </h3>

            {/* Custom styled list for Categories selection */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); setIsFlipped(false); }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Все категории</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  selectedCategory === 'all' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {questions.length}
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const isCatActive = selectedCategory === cat.id;
                const totalInCat = questions.filter(q => q.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); setIsFlipped(false); }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                      isCatActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                        : 'bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isCatActive ? 'bg-white/10 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {renderCategoryIcon(cat.iconName, "w-3.5 h-3.5")}
                      </div>
                      <span className="truncate">{cat.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ml-1 whitespace-nowrap ${
                      isCatActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {totalInCat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BENTO CARD: Difficulty Filter & Shuffling */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-4">
            
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Уровень сложности</span>
              
              {/* Segmented pills selection */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900">
                {['all', 'Junior', 'Middle', 'Senior'].map((diff) => {
                  const isActive = selectedDifficulty === diff;
                  return (
                    <button
                      key={diff}
                      onClick={() => { setSelectedDifficulty(diff); setCurrentIndex(0); setIsFlipped(false); }}
                      className={`py-1.5 rounded-lg text-[10px] font-black uppercase text-center transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {diff === 'all' ? 'Все' : diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shuffling Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Случайный порядок</span>
                <span className="text-[10px] text-slate-400 block">Перемешать все карты</span>
              </div>
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-xl border transition-all ${
                  isShuffled 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                }`}
              >
                <RotateCw className={`w-4 h-4 ${isShuffled ? 'animate-spin-slow' : ''}`} />
              </button>
            </div>

            {/* Leitner Box Reset progression */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={handleResetProgress}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  resetConfirm 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{resetConfirm ? 'Вы уверены? Подтвердить' : 'Сбросить прогресс Лейтнера'}</span>
              </button>
              <p className="text-[9px] text-slate-400 text-center mt-1">
                Это вернет выбранные карты обратно в Коробку 1.
              </p>
            </div>

          </div>

          {/* BENTO CARD: Keyboard Shortcuts Help */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 space-y-3 hidden sm:block">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <Keyboard className="w-4 h-4 text-emerald-500" />
              <span>Горячие клавиши</span>
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                <span>Перевернуть</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-600 font-black">Space</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                <span>Следующая / Прошлая</span>
                <div className="space-x-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-600 font-black">A</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-600 font-black">D</kbd>
                  <span className="text-slate-300">или</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-600 font-black">←</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-600 font-black">→</kbd>
                </div>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800/50">
                <span>Оценка (только с ответом):</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium pl-2">
                <span>Забыл</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-rose-500 font-black">1</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium pl-2">
                <span>С трудом</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-amber-500 font-black">2</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium pl-2">
                <span>Знаю отлично!</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-500 font-black">3</kbd>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FLASHCARD CONTAINER STAGE (col-span-8) */}
        <div ref={studyStageRef} className="lg:col-span-8 space-y-6 scroll-mt-24">
          
          {currentCard ? (
            <div className="space-y-5 animate-fadeIn">
              
              {/* TOP LEVEL NAVIGATION BAR */}
              <div className="flex items-center justify-between px-3">
                
                {/* Active Card Numbering */}
                <div className="text-xs font-extrabold text-slate-500 flex items-center space-x-1.5">
                  <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                    {currentIndex + 1}
                  </span>
                  <span className="text-slate-400">из</span>
                  <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                    {filteredQuestions.length}
                  </span>
                  {selectedBoxFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/10">
                      Коробка {selectedBoxFilter}
                    </span>
                  )}
                </div>

                {/* Left-Right manual click keys */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Предыдущая карточка [A]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextCardOnly}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Следующая карточка [D]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STUDY STAGE CAROUSEL - TACTILE 3D CARD CONTAINER */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full rounded-3xl bg-white dark:bg-[#121927] border-2 ${
                  isFlipped 
                    ? 'border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5' 
                    : 'border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5'
                } p-6 sm:p-9 shadow-2xl cursor-pointer hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/5 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[380px] max-w-full`}
              >
                {/* Backlighting effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full filter blur-2xl group-hover:scale-125 transition-transform" />

                {/* CARD UPPER BAR */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5 z-10">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                      {CATEGORIES.find(c => c.id === currentCard.category)?.title || currentCard.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-extrabold uppercase">
                      {currentCard.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-black">
                    {/* TTS Button */}
                    <button
                      onClick={toggleSpeaking}
                      className={`p-1.5 rounded-lg border transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        isSpeaking 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500'
                      }`}
                      title={isSpeaking ? "Остановить чтение" : "Озвучить карточку голосом"}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 animate-bounce" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    <span className="inline-flex items-center space-x-1 ml-1 font-bold text-[10px] tracking-wider uppercase text-emerald-500">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{isFlipped ? 'ОТВЕТ' : 'ВОПРОС'}</span>
                    </span>
                  </div>
                </div>

                {/* CARD CENTER AREA */}
                <div className="my-auto py-6 space-y-4 z-10">
                  
                  {!isFlipped ? (
                    /* Question side */
                    <div className="space-y-2 animate-fadeIn text-center sm:text-left">
                      <div className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">ВОПРОС</div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mobile-word-break">
                        {renderTextWithMarkdown(currentCard.title)}
                      </h3>
                      <div className="text-xs text-slate-400 pt-4 italic">
                        Нажмите, чтобы перевернуть или нажмите [Пробел]
                      </div>
                    </div>
                  ) : (
                    /* Answer side */
                    <div className="space-y-4 animate-fadeIn">
                      <div className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">ОТВЕТ</div>
                      
                      <div className="text-base text-slate-800 dark:text-slate-100 font-bold leading-relaxed whitespace-pre-line mobile-word-break">
                        {renderTextWithMarkdown(currentCard.summaryAnswer)}
                      </div>

                      {currentCard.fullAnswer && currentCard.fullAnswer !== currentCard.summaryAnswer && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium pt-1 whitespace-pre-line border-t border-slate-100 dark:border-slate-800/80 mt-2">
                          {renderTextWithMarkdown(currentCard.fullAnswer)}
                        </div>
                      )}

                      {/* Code Snippet Box */}
                      {currentCard.codeSnippet && (
                        <div 
                          onClick={(e) => e.stopPropagation()} // Stop flip trigger when clicking inside code snippet
                          className="group/code relative mt-4 rounded-xl bg-slate-950 border border-slate-900 overflow-hidden text-slate-200 text-xs font-mono"
                        >
                          {/* Code header bar */}
                          <div className="bg-slate-900 px-4 py-1.5 flex items-center justify-between border-b border-slate-950">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                              {currentCard.codeSnippet.language}
                            </span>
                            <button
                              onClick={(e) => handleCopyCode(e, currentCard.codeSnippet?.code || '', currentCard.id)}
                              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center space-x-1"
                              title="Копировать код"
                            >
                              {copiedId === currentCard.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-[9px] text-emerald-500 font-bold">Код скопирован!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span className="text-[9px]">Копировать</span>
                                </>
                              )}
                            </button>
                          </div>
                          {/* Code area */}
                          <pre className="p-4 overflow-x-auto select-all max-h-[220px] leading-relaxed">
                            <code>{currentCard.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Expandable Interview Tips Section */}
                      {currentCard.interviewTips && currentCard.interviewTips.length > 0 && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); setShowTips(!showTips); }}
                          className="mt-3 border border-slate-100 dark:border-slate-800/60 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden"
                        >
                          <div className="px-4 py-2.5 flex items-center justify-between select-none">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-amber-500" />
                              <span>💡 Советы для интервью</span>
                            </span>
                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showTips ? 'rotate-90' : ''}`} />
                          </div>
                          
                          {showTips && (
                            <div className="px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-1.5 animate-fadeIn">
                              {currentCard.interviewTips.map((tip, i) => (
                                <div key={i} className="flex items-start space-x-1.5">
                                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                                  <span className="flex-1">{renderTextWithMarkdown(tip)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expandable Common Pitfalls Section */}
                      {currentCard.commonPitfalls && currentCard.commonPitfalls.length > 0 && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); setShowPitfalls(!showPitfalls); }}
                          className="mt-2.5 border border-slate-100 dark:border-slate-800/60 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden"
                        >
                          <div className="px-4 py-2.5 flex items-center justify-between select-none">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-rose-500" />
                              <span>⚠️ Опасные ловушки на собеседовании</span>
                            </span>
                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showPitfalls ? 'rotate-90' : ''}`} />
                          </div>
                          
                          {showPitfalls && (
                            <div className="px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-1.5 animate-fadeIn">
                              {currentCard.commonPitfalls.map((pit, i) => (
                                <div key={i} className="flex items-start space-x-1.5">
                                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                                  <span className="flex-1">{renderTextWithMarkdown(pit)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* CARD FOOTER BAR */}
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{isFlipped ? 'Оцените уровень владения ниже' : 'Кликните на карту, чтобы посмотреть ответ'}</span>
                  <span className="font-extrabold text-emerald-500 group-hover:underline flex items-center space-x-1.5">
                    <span>Клик = Flip</span>
                  </span>
                </div>

              </div>

              {/* ACTION RATING BUTTONS - ONLY SHOW WHEN FLIPPED */}
              <div className="min-h-[80px]">
                {isFlipped ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-fadeIn">
                    
                    {/* OPTION 1: HARD / FORGOT */}
                    <button
                      onClick={() => handleNext('hard')}
                      className="p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 hover:border-rose-500 text-rose-700 dark:text-rose-400 hover:text-white font-extrabold text-xs flex flex-col items-center justify-center space-y-1 transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-1">
                        <X className="w-4 h-4" />
                        <span>Забыл</span>
                      </div>
                      <span className="text-[10px] text-rose-500/70 hover:text-white/80 font-bold">Вернуть в Коробку 1 (Клавиша [1])</span>
                    </button>

                    {/* OPTION 2: GOOD / STRUGGLE */}
                    <button
                      onClick={() => handleNext('good')}
                      className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-700 dark:text-amber-400 hover:text-white font-extrabold text-xs flex flex-col items-center justify-center space-y-1 transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>С трудом</span>
                      </div>
                      <span className="text-[10px] text-amber-500/70 hover:text-white/80 font-bold">Оставить как есть (Клавиша [2])</span>
                    </button>

                    {/* OPTION 3: EASY / EXCELLENT */}
                    <button
                      onClick={() => handleNext('easy')}
                      className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:text-white font-extrabold text-xs flex flex-col items-center justify-center space-y-1 transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Знаю отлично!</span>
                      </div>
                      <span className="text-[10px] text-emerald-500/70 hover:text-white/80 font-bold">Коробка +1 (Клавиша [3])</span>
                    </button>

                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400 font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20">
                    Нажмите на карточку или <kbd className="px-1.5 py-0.5 mx-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black font-mono">Space</kbd>, чтобы увидеть правильный ответ и получить доступ к кнопкам оценки
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* EMPTY STATE FOR CARD FILTERS */
            <div className="text-center py-16 bg-white dark:bg-[#121927] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                <Info className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg">Нет карточек в выбранной категории</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  В коробке {selectedBoxFilter !== 'all' ? selectedBoxFilter : ''} или по уровню "{selectedDifficulty}" в данный момент нет доступных карточек.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleClearAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Сбросить все фильтры</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
