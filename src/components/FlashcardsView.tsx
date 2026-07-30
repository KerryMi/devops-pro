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
  RefreshCw,
  Play,
  ArrowLeft,
  Maximize2,
  CheckCircle,
  XCircle,
  BarChart2
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
    <div className="inline-block w-full text-left font-medium pointer-events-none select-none">
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
  initialCategory?: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  questions,
  progress,
  onUpdateFlashcardBox,
  initialCategory,
}) => {
  // Configuration State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<'all' | number>('all');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);

  // FULL SCREEN / DEDICATED WINDOW MODE STATE
  const [isStudySessionActive, setIsStudySessionActive] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

  // Active Card State
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

  // Swipe / Drag gesture state for cards
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipingOut, setIsSwipingOut] = useState(false);
  const dragStartX = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const hasDraggedFar = useRef<boolean>(false);

  // Toast / Feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Session Timer Effect
  useEffect(() => {
    let interval: any;
    if (isStudySessionActive && !isSessionComplete) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudySessionActive, isSessionComplete]);

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
    if (currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  // Launch Full-Window Study Session
  const startStudySession = () => {
    if (filteredQuestions.length === 0) return;
    setIsStudySessionActive(true);
    setIsSessionComplete(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setTimerSeconds(0);
    setSessionReviewed(0);
    setSessionCorrect(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setShowTips(false);
    setShowPitfalls(false);
  };

  const exitStudySession = () => {
    stopSpeaking();
    setIsStudySessionActive(false);
    setIsSessionComplete(false);
  };

  // Drag Gesture Handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    if (isSwipingOut) return;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    hasDraggedFar.current = false;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || isSwipingOut) return;
    const diffX = clientX - dragStartX.current;
    const diffY = clientY - dragStartY.current;

    // Trigger horizontal swipe tracking only if diffX > 15px and horizontal > vertical * 1.5
    if (Math.abs(diffX) > 15 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      hasDraggedFar.current = true;
      setDragOffsetX(diffX);
    }
  };

  const triggerAnimatedNext = (rating: 'hard' | 'good' | 'easy') => {
    if (isSwipingOut) return;
    setIsSwipingOut(true);

    const targetX = rating === 'easy' ? 450 : rating === 'hard' ? -450 : 0;
    if (targetX !== 0) {
      setDragOffsetX(targetX);
    }

    setTimeout(() => {
      handleNext(rating);
      setDragOffsetX(0);
      setIsSwipingOut(false);
    }, 220);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Smooth threshold evaluation
    if (dragOffsetX > 75) {
      triggerAnimatedNext('easy');
    } else if (dragOffsetX < -75) {
      triggerAnimatedNext('hard');
    } else {
      setDragOffsetX(0);
    }
  };

  // Navigation Controls
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
      setIsSessionComplete(true);
    }
  };

  // Text-to-Speech API integration
  const startSpeaking = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
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
    e.stopPropagation();
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

  useEffect(() => {
    stopSpeaking();
  }, [currentIndex, isFlipped]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'escape' && isStudySessionActive) {
        exitStudySession();
        return;
      }

      if (!isStudySessionActive || isSessionComplete) return;

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
  }, [currentIndex, isFlipped, filteredQuestions.length, isStudySessionActive, isSessionComplete]);

  // Code copy utility
  const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Leitner box Reset progression handler
  const handleResetProgress = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    } else {
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

  // Stats Calculations
  const totalInFilter = filteredQuestions.length;
  const box5InFilter = filteredQuestions.filter(q => (progress.flashcardBoxes?.[q.id] || 1) === 5).length;
  const masteryPercentage = totalInFilter > 0 ? Math.round((box5InFilter / totalInFilter) * 100) : 0;
  const selectedCatObj = CATEGORIES.find(c => c.id === selectedCategory);

  // =========================================================
  // VIEW MODE 2: DEDICATED FULL-WINDOW STUDY SESSION
  // =========================================================
  if (isStudySessionActive) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#080d1a] text-slate-800 dark:text-slate-100 flex flex-col pt-16 sm:pt-8 pb-4 px-4 sm:p-6 lg:p-8 overflow-y-auto animate-fadeIn">
        
        {/* TOP BAR NAVIGATION & METRICS */}
        <div className="max-w-5xl w-full mx-auto flex flex-row items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exitStudySession}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all flex items-center space-x-1.5 sm:space-x-2 cursor-pointer shadow-sm shrink-0"
              title="Завершить сессию [Esc]"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="sm:hidden">Назад</span>
              <span className="hidden sm:inline">Назад к настройкам</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
                {selectedCatObj ? selectedCatObj.title : 'Все категории'}
              </span>
              {selectedDifficulty !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                  {selectedDifficulty}
                </span>
              )}
              {selectedBoxFilter !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                  Коробка {selectedBoxFilter}
                </span>
              )}
            </div>
          </div>

          {/* SESSION METRICS */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-slate-900/80 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[11px] sm:text-xs font-mono">
              <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300">
                <Timer className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400 font-extrabold">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{currentStreak}</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
              <div className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                {sessionReviewed > 0 ? `${Math.round((sessionCorrect / sessionReviewed) * 100)}%` : '100%'}
              </div>
            </div>
          </div>

          </div>

        {/* PROGRESS BAR ACROSS TOP */}
        <div className="max-w-5xl w-full mx-auto my-3 shrink-0">
          <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)}%` }}
            />
          </div>
        </div>

        {/* MAIN STAGE CONTENT */}
        <div className="max-w-4xl w-full mx-auto my-auto py-4 flex flex-col justify-center">
          
          {isSessionComplete ? (
            /* SESSION FINISHED STATE */
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xl animate-scaleUp max-w-xl mx-auto my-auto">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xl">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Отличная работа!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Вы успешно просмотрели все {filteredQuestions.length} карточек в этом наборе.
                </p>
              </div>

              {/* STATS SUMMARY TILES */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Оценено</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{sessionReviewed}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Точность</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {sessionReviewed > 0 ? `${Math.round((sessionCorrect / sessionReviewed) * 100)}%` : '100%'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Макс. стрик</div>
                  <div className="text-xl font-black text-orange-600 dark:text-orange-400 mt-1">{maxStreak}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={startStudySession}
                  className="flex-1 py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Повторить сессию</span>
                </button>
                <button
                  onClick={exitStudySession}
                  className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>К настройкам</span>
                </button>
              </div>
            </div>
          ) : currentCard ? (
            /* ACTIVE CARD DISPLAY */
            <div className="space-y-5 animate-fadeIn">
              
              <div 
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onClick={() => {
                  if (hasDraggedFar.current || Math.abs(dragOffsetX) > 15 || isSwipingOut) return;
                  setIsFlipped(prev => !prev);
                }}
                style={{
                  transform: `translateX(${dragOffsetX}px) rotate(${dragOffsetX * 0.04}deg)`,
                  opacity: isSwipingOut ? 0 : 1,
                  transition: isDragging 
                    ? 'none' 
                    : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease-out',
                  touchAction: 'pan-y'
                }}
                className={`relative w-full rounded-3xl bg-white dark:bg-slate-900 border-2 ${
                  isFlipped 
                    ? 'border-emerald-500/40 shadow-2xl shadow-emerald-500/5' 
                    : 'border-slate-200 dark:border-slate-800 shadow-2xl'
                } p-6 sm:p-10 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[420px] max-w-full select-none`}
              >
                {/* Backlighting effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

                {/* Swipe Indicators */}
                {dragOffsetX > 15 && (
                  <div 
                    style={{ opacity: Math.min(1, (dragOffsetX - 10) / 50) }}
                    className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1 animate-fadeIn pointer-events-none"
                  >
                    <Check className="w-4 h-4" />
                    <span>Знаю!</span>
                  </div>
                )}
                {dragOffsetX < -15 && (
                  <div 
                    style={{ opacity: Math.min(1, (-dragOffsetX - 10) / 50) }}
                    className="absolute top-6 left-6 z-30 px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1 animate-fadeIn pointer-events-none"
                  >
                    <X className="w-4 h-4" />
                    <span>Забыл</span>
                  </div>
                )}

                {/* CARD UPPER BAR */}
                <div className="flex flex-wrap items-center justify-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 z-10">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap">
                    {CATEGORIES.find(c => c.id === currentCard.category)?.title || currentCard.category}
                  </span>
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] sm:text-xs font-extrabold uppercase border border-slate-200 dark:border-slate-700/80 whitespace-nowrap">
                    {currentCard.difficulty}
                  </span>
                </div>

                {/* CARD CENTER AREA */}
                <div className="my-auto py-8 space-y-4 z-10">
                  
                  {!isFlipped ? (
                    /* Question side */
                    <div className="space-y-4 animate-fadeIn">
                      <div className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400/80 tracking-widest flex items-center space-x-2">
                        <span>НАЖМИТЕ ДЛЯ ПРОСМОТРА ОТВЕТА</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug mobile-word-break">
                        {renderTextWithMarkdown(currentCard.title)}
                      </h3>
                    </div>
                  ) : (
                    /* Answer side */
                    <div className="space-y-5 animate-fadeIn">
                      <div className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest flex items-center justify-between">
                        <span>ПРАВИЛЬНЫЙ ОТВЕТ</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Нажмите чтобы зарыть</span>
                      </div>
                      
                      <div className="text-lg sm:text-xl text-slate-900 dark:text-slate-100 font-extrabold leading-relaxed whitespace-pre-line mobile-word-break">
                        {renderTextWithMarkdown(currentCard.summaryAnswer)}
                      </div>

                      {currentCard.fullAnswer && currentCard.fullAnswer !== currentCard.summaryAnswer && (
                        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-2 whitespace-pre-line border-t border-slate-200 dark:border-slate-800/80 mt-2">
                          {renderTextWithMarkdown(currentCard.fullAnswer)}
                        </div>
                      )}

                      {/* Code Snippet Box */}
                      {currentCard.codeSnippet && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="group/code relative mt-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-200 text-xs font-mono"
                        >
                          <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400">
                              {currentCard.codeSnippet.language}
                            </span>
                            <button
                              onClick={(e) => handleCopyCode(e, currentCard.codeSnippet?.code || '', currentCard.id)}
                              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
                            >
                              {copiedId === currentCard.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-[10px] text-emerald-500 font-bold">Скопировано!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Копировать</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto select-all max-h-[260px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                            <code>{currentCard.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Interview Tips Section */}
                      {currentCard.interviewTips && currentCard.interviewTips.length > 0 && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); setShowTips(!showTips); }}
                          className="mt-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/60 overflow-hidden"
                        >
                          <div className="px-4 py-3 flex items-center justify-between select-none cursor-pointer">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-300 flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-amber-500" />
                              <span>💡 Советы для интервью</span>
                            </span>
                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showTips ? 'rotate-90' : ''}`} />
                          </div>
                          
                          {showTips && (
                            <div className="px-4 pb-3 pt-1 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5 animate-fadeIn">
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

                      {/* Common Pitfalls Section */}
                      {currentCard.commonPitfalls && currentCard.commonPitfalls.length > 0 && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); setShowPitfalls(!showPitfalls); }}
                          className="mt-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/60 overflow-hidden"
                        >
                          <div className="px-4 py-3 flex items-center justify-between select-none cursor-pointer">
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-300 flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-rose-500" />
                              <span>⚠️ Опасные ловушки на собеседовании</span>
                            </span>
                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showPitfalls ? 'rotate-90' : ''}`} />
                          </div>
                          
                          {showPitfalls && (
                            <div className="px-4 pb-3 pt-1 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5 animate-fadeIn">
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
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium select-none pointer-events-none">
                  <span className="truncate mr-2">
                    {isFlipped ? 'Нажмите в любом месте карточки, чтобы перевернуть обратно' : 'Свайп влево — Забыл | Свайп вправо — Знаю'}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold shrink-0">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </span>
                </div>

              </div>

              {/* ACTION RATING BUTTONS - ALWAYS VISIBLE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* OPTION 1: HARD / FORGOT */}
                <button
                  onClick={(e) => { e.stopPropagation(); triggerAnimatedNext('hard'); }}
                  className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/60 text-rose-600 dark:text-rose-400 font-extrabold text-sm flex flex-col items-center justify-center space-y-1 transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center space-x-1.5">
                    <X className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    <span>Забыл [1]</span>
                  </div>
                  <span className="text-[10px] text-rose-500/80 dark:text-rose-400/80 font-bold">Вернуть в Коробку 1</span>
                </button>

                {/* OPTION 2: GOOD / STRUGGLE */}
                <button
                  onClick={(e) => { e.stopPropagation(); triggerAnimatedNext('good'); }}
                  className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-600 dark:text-amber-400 font-extrabold text-sm flex flex-col items-center justify-center space-y-1 transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>С трудом [2]</span>
                  </div>
                  <span className="text-[10px] text-amber-500/80 dark:text-amber-400/80 font-bold">Оставить как есть</span>
                </button>

                {/* OPTION 3: EASY / EXCELLENT */}
                <button
                  onClick={(e) => { e.stopPropagation(); triggerAnimatedNext('easy'); }}
                  className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex flex-col items-center justify-center space-y-1 transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Знаю отлично! [3]</span>
                  </div>
                  <span className="text-[10px] text-emerald-500/80 dark:text-emerald-400/80 font-bold">Продвинуть в Коробку +1</span>
                </button>

              </div>

              {/* NAVIGATION & SHORTCUTS FOOTER */}
              <div className="hidden sm:flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center space-x-2">
                  <button onClick={handlePrev} className="hover:text-slate-900 dark:hover:text-slate-300 flex items-center space-x-1 font-bold">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Пред. [A]</span>
                  </button>
                  <span>•</span>
                  <button onClick={handleNextCardOnly} className="hover:text-slate-900 dark:hover:text-slate-300 flex items-center space-x-1 font-bold">
                    <span>След. [D]</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">Space</kbd>
                  <span>Перевернуть</span>
                </div>
              </div>

            </div>
          ) : null}

        </div>

      </div>
    );
  }

  // =========================================================
  // VIEW MODE 1: CONFIGURATION & LAUNCH HUB SCREEN
  // =========================================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Toast Feedback */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-sm font-semibold animate-mobileSlideUp">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header section with Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center">
              <Brain className="w-3.5 h-3.5 mr-1" />
              <span>Система Лейтнера</span>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Интервальное повторение
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Метод интервальных повторений помогает закрепить сложные концепции в долгосрочной памяти. Выберите категорию, сложность и запустите сессию.
          </p>
        </div>
        
        {/* Quick Mastery Badge in header */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2.5 rounded-2xl flex items-center space-x-3 self-start md:self-auto shrink-0 shadow-sm">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Освоено (Коробка 5)</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {box5InFilter} / {totalInFilter}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm border border-emerald-500/20">
            {masteryPercentage}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT/MAIN COLUMN: SELECTION FLOW */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: CATEGORY SELECTION */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>1. Выберите категорию знаний</span>
              </h3>
              {selectedCategory !== 'all' && (
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-emerald-500 hover:underline font-semibold"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              <button
                onClick={() => { setSelectedCategory('all'); }}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-sm">Все категории</span>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                  selectedCategory === 'all' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {questions.length} карт
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const isCatActive = selectedCategory === cat.id;
                const totalInCat = questions.filter(q => q.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); }}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border cursor-pointer ${
                      isCatActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                        : 'bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCatActive ? 'bg-white/10 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {renderCategoryIcon(cat.iconName, "w-4 h-4")}
                      </div>
                      <span className="truncate font-extrabold text-sm">{cat.title}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-black ml-1 whitespace-nowrap ${
                      isCatActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {totalInCat} карт
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: DIFFICULTY & SHUFFLING */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-5">
            
            {/* Difficulty Selection */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">2. Выберите уровень сложности</span>
              
              <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                {['all', 'Junior', 'Middle', 'Senior'].map((diff) => {
                  const isActive = selectedDifficulty === diff;
                  return (
                    <button
                      key={diff}
                      onClick={() => { setSelectedDifficulty(diff); }}
                      className={`py-2 rounded-xl text-xs font-black uppercase text-center transition-all cursor-pointer ${
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
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Случайный порядок</span>
                <span className="text-xs text-slate-400 block">Перемешать все выбранные карточки</span>
              </div>
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isShuffled 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                }`}
              >
                <RotateCw className={`w-5 h-5 ${isShuffled ? 'animate-spin-slow' : ''}`} />
              </button>
            </div>

            {/* Reset Progress */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={handleResetProgress}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-extrabold transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                  resetConfirm 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{resetConfirm ? 'Вы уверены? Нажмите для подтверждения' : 'Сбросить прогресс Лейтнера'}</span>
              </button>
            </div>

          </div>

          {/* Keyboard Shortcuts Helper */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <Keyboard className="w-4 h-4 text-emerald-500" />
              <span>Горячие клавиши в окне просмотра</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Перевернуть:</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-emerald-500 font-black">Space</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Выход:</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-amber-500 font-black">Esc</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Забыл [1]:</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-rose-500 font-black">1</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Знаю отлично! [3]:</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-emerald-500 font-black">3</kbd>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PROGRESS METRICS, LEITNER FILTER & LAUNCH BUTTON */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LEITNER METHOD BOXES (STEP 3) */}
          <div className="bento-card bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-500" />
                <span>3. Коробки Лейтнера (Фильтр)</span>
              </span>
              {selectedBoxFilter !== 'all' && (
                <button 
                  onClick={() => setSelectedBoxFilter('all')}
                  className="text-xs text-emerald-500 hover:underline font-semibold"
                >
                  Все коробки
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Коробка отражает степень запоминания. Новые карты попадают в Коробку 1, а изученные продвигаются до Коробки 5. Выберите коробку для фокусной тренировки.
            </p>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((boxNum) => {
                const isActive = selectedBoxFilter === boxNum;
                const count = boxesCount[boxNum - 1];
                
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
                    className={`p-2 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-between items-center ${
                      isActive 
                        ? `${currentStyle.active} border-2 shadow-sm`
                        : `border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 ${currentStyle.border}`
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">К{boxNum}</div>
                    <div className="flex items-baseline justify-center mt-1">
                      <span className="text-base font-black text-slate-900 dark:text-white leading-none">
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visual Progress Bar inside sidebar */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
                <span>Прогресс освоения (Коробка 5)</span>
                <span>{masteryPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
                <div 
                  className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${masteryPercentage}%` }}
                />
              </div>
            </div>

          </div>

          {/* THE LAUNCH CONFIGURATION CARD (STEP 4) */}
          <div className="bento-card flex flex-col justify-between space-y-5 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#121c2c] dark:to-[#0a111c] border-2 border-slate-200 dark:border-emerald-500/30 text-slate-800 dark:text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
                    4. ПОДТВЕРЖДЕНИЕ
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Запустить сессию
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Карточки откроются на весь экран в режиме концентрации без отвлекающих элементов.
              </p>

              {/* Summary Configuration List */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Категория:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCatObj ? selectedCatObj.title : 'Все категории'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Сложность:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDifficulty === 'all' ? 'Все уровни' : selectedDifficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Коробка Лейтнера:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedBoxFilter === 'all' ? 'Все коробки' : `Коробка ${selectedBoxFilter}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Порядок карт:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{isShuffled ? 'Случайный' : 'По порядку'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 relative z-10 space-y-2">
              <button
                onClick={startStudySession}
                disabled={filteredQuestions.length === 0}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
                  filteredQuestions.length > 0
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
                <span>
                  {filteredQuestions.length > 0 
                    ? `Открыть карточки (${filteredQuestions.length} шт)` 
                    : 'Нет карточек в фильтре'}
                </span>
              </button>

              {filteredQuestions.length === 0 && (
                <button
                  onClick={handleClearAllFilters}
                  className="w-full text-center text-xs text-amber-400 hover:underline font-bold"
                >
                  Сбросить фильтры для просмотра карточек
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
