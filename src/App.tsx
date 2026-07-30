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
import { DevOpsRoadmap } from './components/DevOpsRoadmap';
import { Footer } from './components/Footer';

import { QUESTIONS as DEFAULT_QUESTIONS } from './data/questions';
import { QUIZZES as DEFAULT_QUIZZES } from './data/quizzes';
import { CategoryId, UserProgress, ExperienceLegend, QuizResult, Question, Quiz } from './types';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { 
  loadQuestions, 
  saveQuestions, 
  loadQuizzes, 
  saveQuizzes, 
  getAdminState, 
  setAdminState, 
  resetAllDataToDefault 
} from './utils/customDataStorage';
import { evaluateAchievements } from './data/achievements';
import { calculateUserGamification, ITRank } from './utils/gamification';
import { calculateDetailedReadiness } from './utils/readiness';
import { RankUpModal } from './components/RankUpModal';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { ToastNotificationContainer, ToastItem } from './components/ToastNotificationContainer';
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
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => loadQuizzes());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getAdminState());

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryId | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('devops_pro_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Toast notifications & Gamification trackers
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [celebratedRank, setCelebratedRank] = useState<ITRank | null>(null);
  const [seenAchievementIds, setSeenAchievementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('devops_pro_seen_achievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const triggerToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newToast: ToastItem = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSetIsAdmin = (val: boolean) => {
    setIsAdmin(val);
    setAdminState(val);
  };

  const handleUpdateQuestions = (newQ: Question[]) => {
    setQuestions(newQ);
    saveQuestions(newQ);
  };

  const handleUpdateQuizzes = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes);
    saveQuizzes(newQuizzes);
  };

  const handleResetAllData = () => {
    resetAllDataToDefault();
    setQuestions(DEFAULT_QUESTIONS);
    setQuizzes(DEFAULT_QUIZZES);
  };

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

  // Calculate Achievements & Gamification Stats
  const gamification = calculateUserGamification(progress, questions);
  const achievements = gamification.achievements;
  const unlockedAchievementsCount = gamification.unlockedAchievementsCount;
  const totalAchievementsCount = gamification.totalAchievementsCount;
  const unseenAchievementsCount = achievements.filter(a => a.isUnlocked && !seenAchievementIds.includes(a.id)).length;

  // Detect level up & open celebration modal
  const prevLevelRef = React.useRef<number>(0);
  useEffect(() => {
    const currentLevel = gamification.level;
    // Set initial level on first load without triggering modal
    if (prevLevelRef.current === 0) {
      prevLevelRef.current = currentLevel;
      return;
    }

    if (currentLevel > prevLevelRef.current) {
      const newRank = gamification.rank;
      setCelebratedRank(newRank);
    }

    prevLevelRef.current = currentLevel;
  }, [gamification.level]);

  // Mark achievements as seen when viewing achievements tab
  useEffect(() => {
    if (activeTab === 'achievements') {
      const currentUnlockedIds = achievements.filter(a => a.isUnlocked).map(a => a.id);
      setSeenAchievementIds(prev => {
        const merged = Array.from(new Set([...prev, ...currentUnlockedIds]));
        localStorage.setItem('devops_pro_seen_achievements', JSON.stringify(merged));
        return merged;
      });
    }
  }, [activeTab]);

  // Detect newly unlocked achievements & trigger toast
  const prevUnlockedRef = React.useRef<string[]>([]);
  useEffect(() => {
    const currentUnlocked = achievements.filter(a => a.isUnlocked);
    const currentUnlockedIds = currentUnlocked.map(a => a.id);
    
    // Check if newly unlocked (only after initial load)
    if (prevUnlockedRef.current.length > 0) {
      const newlyUnlocked = currentUnlocked.filter(a => !prevUnlockedRef.current.includes(a.id));
      newlyUnlocked.forEach(ach => {
        triggerToast({
          title: ach.title,
          message: ach.description,
          xpReward: ach.xpReward || 100,
          type: 'achievement'
        });
      });
    }

    prevUnlockedRef.current = currentUnlockedIds;
  }, [progress, questions]);

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

  // Detailed Readiness Score calculation
  const totalQuestions = questions.length;
  const masteredCount = progress.masteredQuestionIds.length;
  const detailedReadiness = calculateDetailedReadiness(progress, questions);
  const readinessScore = detailedReadiness.totalScore;

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

  // Reset scroll position on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

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
    triggerToast({
      title: 'Авария устранена!',
      message: 'Вы успешно восстановили стабильность продакшена.',
      xpReward: 250,
      type: 'quest'
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
      
      {/* Toast Notifications */}
      <ToastNotificationContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Rank Up Celebration Modal */}
      <RankUpModal rank={celebratedRank} onClose={() => setCelebratedRank(null)} />

      {/* Desktop Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        masteredCount={masteredCount}
        totalQuestionsCount={totalQuestions}
        unlockedAchievementsCount={unlockedAchievementsCount}
        totalAchievementsCount={totalAchievementsCount}
        unseenAchievementsCount={unseenAchievementsCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        isAdmin={isAdmin}
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
          unseenAchievementsCount={unseenAchievementsCount}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentUser={currentUser}
        />

        {/* Main Container View Area - starts from top on desktop without top bar */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-[calc(7.5rem+env(safe-area-inset-bottom,16px))] lg:pb-16 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              progress={progress}
              questions={questions}
              onNavigate={handleNavigate}
              readinessScore={readinessScore}
              onUpdateProgress={setProgress}
              unseenAchievementsCount={unseenAchievementsCount}
            />
          )}

          {activeTab === 'roadmap' && (
            <DevOpsRoadmap
              questions={questions}
              progress={progress}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              progress={progress}
              questions={questions}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionsView
              questions={questions}
              progress={progress}
              onToggleMastered={handleToggleMastered}
              onToggleBookmark={handleToggleBookmark}
              onSaveNote={handleSaveNote}
              initialCategory={selectedCategoryFilter}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              questions={questions}
              progress={progress}
              onUpdateFlashcardBox={handleUpdateFlashcardBox}
              initialCategory={selectedCategoryFilter}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizView
              onSaveQuizResult={handleSaveQuizResult}
              quizzes={quizzes}
              progress={progress}
              initialCategory={selectedCategoryFilter}
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
              initialCategory={selectedCategoryFilter}
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

          {activeTab === 'admin' && (
            <AdminView
              questions={questions}
              quizzes={quizzes}
              onUpdateQuestions={handleUpdateQuestions}
              onUpdateQuizzes={handleUpdateQuizzes}
              progress={progress}
              onResetAllData={handleResetAllData}
              isAdmin={isAdmin}
              onSetIsAdmin={handleSetIsAdmin}
            />
          )}
        </main>

        {/* Footer - only on main page */}
        {activeTab === 'dashboard' && <Footer onNavigate={handleNavigate} />}
      </div>

    </div>
  );
}
