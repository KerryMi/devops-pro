export type CategoryId = 
  | 'docker' 
  | 'k8s' 
  | 'linux' 
  | 'cicd' 
  | 'terraform' 
  | 'cloud' 
  | 'monitoring' 
  | 'networking' 
  | 'ansible'
  | 'sysdesign';

export type DifficultyLevel = 'Junior' | 'Middle' | 'Senior';

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  description: string;
  iconName: string;
  color: string; // Tailwind color class
  bgLight: string;
}

export interface Question {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  summaryAnswer: string;
  fullAnswer: string;
  codeSnippet?: {
    language: string;
    code: string;
    description?: string;
  };
  interviewTips?: string[]; // E.g. "Как отвечать рекрутеру", "Что часто спрашивают на фанаг/бигтех"
  commonPitfalls?: string[];
  tags: string[];
}

export interface Flashcard {
  id: string;
  questionId: string;
  question: string;
  answer: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  code?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: CategoryId;
  difficulty?: DifficultyLevel;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: CategoryId | 'all';
  difficulty: DifficultyLevel | 'All';
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  date: string;
  passed: boolean;
  stars?: number;
  xpReward?: number;
}

export interface IncidentScenario {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  symptoms: string[];
  initialLogs: string;
  diagnosticSteps: {
    command: string;
    output: string;
    hint: string;
  }[];
  fixOptions: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  rootCause: string;
  preventionTips: string[];
}

export interface ExperienceLegend {
  id: string;
  companyName: string;
  roleTitle: string;
  projectType: string;
  teamSize: string;
  stack: string[];
  architectureSummary: string;
  cicdProcess: string;
  monitoringSetup: string;
  incidentStory: string;
  metrics: string[];
  aiPolishedText?: string;
  updatedAt: string;
}

export interface ResumeChecklistItem {
  id: string;
  category: 'Structure' | 'Skills' | 'Metrics' | 'ATS' | 'Language';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Essential';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Learning' | 'Practice' | 'Streak' | 'Career';
  iconName: string;
  color: string;
  bgLight: string;
  currentValue: number;
  goalValue: number;
  unit?: string;
  isUnlocked: boolean;
  xpReward?: number;
}

export interface UserProgress {
  masteredQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  flashcardBoxes: Record<string, number>; // flashcardId -> 1..5
  flashcardLastReview: Record<string, string>;
  quizResults: QuizResult[];
  dailyStreak: number;
  lastActiveDate: string;
  customNotes: Record<string, string>; // questionId -> user notes
  savedLegend?: ExperienceLegend;
  solvedIncidentIds?: string[];
  completedInterviewSessionsCount?: number;
  lastDailyBlitzDate?: string;
  dailyBlitzHistory?: Record<string, { score: number; total: number; completedAt: string }>;
  seenAchievementIds?: string[];
}
