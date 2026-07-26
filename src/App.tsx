import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { QuestionsView } from './components/QuestionsView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { LegendBuilderView } from './components/LegendBuilderView';
import { ResumeGuideView } from './components/ResumeGuideView';
import { IncidentsView } from './components/IncidentsView';
import { CheatsheetsView } from './components/CheatsheetsView';
import { AchievementsView } from './components/AchievementsView';

import { QUESTIONS } from './data/questions';
import { CategoryId, UserProgress, ExperienceLegend, QuizResult } from './types';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { evaluateAchievements } from './data/achievements';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryId | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('devops_pro_theme');
    return saved !== null ? saved === 'dark' : false;
  });

  // Calculate Achievements
  const achievements = evaluateAchievements(progress, QUESTIONS);
  const unlockedAchievementsCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievementsCount = achievements.length;

  // Sync dark mode class and data-theme attribute on <html> and <body>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('devops_pro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('devops_pro_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist progress changes
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Scroll to top on tab transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activeTab]);

  // Readiness Score % calculation
  const totalQuestions = QUESTIONS.length;
  const masteredCount = progress.masteredQuestionIds.length;
  const readinessScore = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  // Progress Handlers
  const handleToggleMastered = (questionId: string) => {
    setProgress(prev => {
      const isMastered = prev.masteredQuestionIds.includes(questionId);
      const updated = isMastered
        ? prev.masteredQuestionIds.filter(id => id !== questionId)
        : [...prev.masteredQuestionIds, questionId];
      return { ...prev, masteredQuestionIds: updated };
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(questionId);
      const updated = isBookmarked
        ? prev.bookmarkedQuestionIds.filter(id => id !== questionId)
        : [...prev.bookmarkedQuestionIds, questionId];
      return { ...prev, bookmarkedQuestionIds: updated };
    });
  };

  const handleSaveNote = (questionId: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      customNotes: {
        ...prev.customNotes,
        [questionId]: note
      }
    }));
  };

  const handleUpdateFlashcardBox = (questionId: string, newBox: number) => {
    setProgress(prev => ({
      ...prev,
      flashcardBoxes: {
        ...prev.flashcardBoxes,
        [questionId]: newBox
      }
    }));
  };

  const handleSaveLegend = (legend: ExperienceLegend) => {
    setProgress(prev => ({
      ...prev,
      savedLegend: legend
    }));
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    setProgress(prev => ({
      ...prev,
      quizResults: [result, ...prev.quizResults]
    }));
  };

  const handleSolveIncident = (scenarioId: string) => {
    setProgress(prev => {
      const current = prev.solvedIncidentIds || [];
      if (current.includes(scenarioId)) return prev;
      return {
        ...prev,
        solvedIncidentIds: [...current, scenarioId]
      };
    });
  };

  const handleNavigate = (tab: TabType, filterCategory?: CategoryId) => {
    setActiveTab(tab);
    if (filterCategory) {
      setSelectedCategoryFilter(filterCategory);
    }
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        masteredCount={masteredCount}
        totalQuestionsCount={totalQuestions}
        unlockedAchievementsCount={unlockedAchievementsCount}
        totalAchievementsCount={totalAchievementsCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Top Header Navigation for Mobile Only */}
      <div className="lg:ml-64 transition-all">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigate={handleNavigate}
          masteredCount={masteredCount}
          totalQuestionsCount={totalQuestions}
          unlockedAchievementsCount={unlockedAchievementsCount}
          totalAchievementsCount={totalAchievementsCount}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Main Container View Area - starts from top on desktop without top bar */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-28 lg:pb-16 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              progress={progress}
              questions={QUESTIONS}
              onNavigate={handleNavigate}
              readinessScore={readinessScore}
              onUpdateProgress={setProgress}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              progress={progress}
              questions={QUESTIONS}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionsView
              questions={QUESTIONS}
              progress={progress}
              onToggleMastered={handleToggleMastered}
              onToggleBookmark={handleToggleBookmark}
              onSaveNote={handleSaveNote}
              initialCategory={selectedCategoryFilter}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              questions={QUESTIONS}
              progress={progress}
              onUpdateFlashcardBox={handleUpdateFlashcardBox}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizView
              onSaveQuizResult={handleSaveQuizResult}
            />
          )}

          {activeTab === 'legend' && (
            <LegendBuilderView
              savedLegend={progress.savedLegend}
              onSaveLegend={handleSaveLegend}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeGuideView />
          )}

          {activeTab === 'incidents' && (
            <IncidentsView
              onSolveIncident={handleSolveIncident}
              solvedIncidentIds={progress.solvedIncidentIds || []}
            />
          )}

          {activeTab === 'cheatsheet' && (
            <CheatsheetsView />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400">
          <p>DevOps Pro — Интерактивный тренажер и карьерный хаб для DevOps инженеров (Bento Edition)</p>
        </footer>
      </div>

    </div>
  );
}
