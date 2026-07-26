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
import { Footer } from './components/Footer';

import { QUESTIONS } from './data/questions';
import { CategoryId, UserProgress, ExperienceLegend, QuizResult } from './types';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { evaluateAchievements } from './data/achievements';
import { ProfileView } from './components/ProfileView';
import { auth, loadProgressFromFirestore, saveProgressToFirestore } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

function mergeProgress(local: UserProgress, cloud: any): UserProgress {
  const masteredQuestionIds = Array.from(new Set([
    ...(local.masteredQuestionIds || []),
    ...(cloud.masteredQuestionIds || [])
  ]));
  
  const bookmarkedQuestionIds = Array.from(new Set([
    ...(local.bookmarkedQuestionIds || []),
    ...(cloud.bookmarkedQuestionIds || [])
  ]));

  const solvedIncidentIds = Array.from(new Set([
    ...(local.solvedIncidentIds || []),
    ...(cloud.solvedIncidentIds || [])
  ]));

  const flashcardBoxes = { ...(local.flashcardBoxes || {}), ...(cloud.flashcardBoxes || {}) };
  const flashcardLastReview = { ...(local.flashcardLastReview || {}), ...(cloud.flashcardLastReview || {}) };
  const customNotes = { ...(local.customNotes || {}), ...(cloud.customNotes || {}) };
  const dailyBlitzHistory = { ...(local.dailyBlitzHistory || {}), ...(cloud.dailyBlitzHistory || {}) };

  const allResults = [...(local.quizResults || []), ...(cloud.quizResults || [])];
  const uniqueResultsMap = new Map();
  allResults.forEach(r => {
    if (r && r.id) uniqueResultsMap.set(r.id, r);
  });
  const quizResults = Array.from(uniqueResultsMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    ...local,
    ...cloud,
    masteredQuestionIds,
    bookmarkedQuestionIds,
    solvedIncidentIds,
    flashcardBoxes,
    flashcardLastReview,
    customNotes,
    dailyBlitzHistory,
    quizResults
  };
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryId | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('devops_pro_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync Authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const cloudProgress = await loadProgressFromFirestore(user.uid);
          if (cloudProgress) {
            setProgress(prev => mergeProgress(prev, cloudProgress));
          } else {
            // New cloud account: Seed it with local progress
            const localProgress = loadUserProgress();
            await saveProgressToFirestore(user.uid, localProgress, true);
          }
        } catch (err) {
          console.error('Error loading/merging progress from cloud:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Calculate Achievements
  const achievements = evaluateAchievements(progress, QUESTIONS);
  const unlockedAchievementsCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievementsCount = achievements.length;

  // Sync dark mode class and data-theme attribute on <html> and <body>, plus mobile meta tags
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('devops_pro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('devops_pro_theme', 'light');
    }

    const themeMeta = document.getElementById('theme-color-meta');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDarkMode ? '#0b1329' : '#f8fafc');
    }
    const statusMeta = document.getElementById('status-bar-style-meta');
    if (statusMeta) {
      statusMeta.setAttribute('content', isDarkMode ? 'black-translucent' : 'default');
    }
  }, [isDarkMode]);

  // Persist progress changes
  useEffect(() => {
    saveUserProgress(progress);
    if (currentUser) {
      saveProgressToFirestore(currentUser.uid, progress).catch(err => {
        console.error('Failed to sync progress to Firestore:', err);
      });
    }
  }, [progress, currentUser]);

  const handleManualSync = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const cloudProgress = await loadProgressFromFirestore(currentUser.uid);
      if (cloudProgress) {
        setProgress(prev => mergeProgress(prev, cloudProgress));
      } else {
        await saveProgressToFirestore(currentUser.uid, progress, true);
      }
    } catch (err) {
      console.error('Manual sync error:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

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
        currentUser={currentUser}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-[calc(7.5rem+env(safe-area-inset-bottom,16px))] lg:pb-16 min-w-0 overflow-x-hidden">
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

          {activeTab === 'profile' && (
            <ProfileView
              user={currentUser}
              progress={progress}
              isSyncing={isSyncing}
              onSyncManual={handleManualSync}
            />
          )}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

    </div>
  );
}
