import { UserProgress, Question } from '../types';
import { INCIDENT_SCENARIOS } from '../data/incidents';
import { QUIZZES } from '../data/quizzes';

export interface ReadinessPillar {
  id: 'theory' | 'incidents' | 'quizzes' | 'flashcards' | 'legend';
  label: string;
  pct: number;
  weightPct: number;
  score: number;
  color: string;
  bgBg: string;
  badgeText: string;
}

export interface DetailedReadiness {
  totalScore: number;
  levelTitle: string;
  levelBadgeBg: string;
  levelTextColor: string;
  pillars: ReadinessPillar[];
  recommendation: {
    title: string;
    advice: string;
    targetTab: string;
  };
}

export function calculateDetailedReadiness(progress: UserProgress, questions: Question[]): DetailedReadiness {
  const totalQuestions = questions.length || 1;
  const masteredCount = progress.masteredQuestionIds.length;
  const theoryPct = Math.min(100, Math.round((masteredCount / totalQuestions) * 100));
  const theoryScore = Math.round((theoryPct * 35) / 100);

  const totalIncidents = INCIDENT_SCENARIOS.length || 1;
  const solvedIncidents = (progress.solvedIncidentIds || []).length;
  const incidentsPct = Math.min(100, Math.round((solvedIncidents / totalIncidents) * 100));
  const incidentsScore = Math.round((incidentsPct * 25) / 100);

  const totalQuizzes = QUIZZES.length || 1;
  const passedQuizIds = new Set((progress.quizResults || []).filter(r => r.passed).map(r => r.quizId));
  const quizzesPct = Math.min(100, Math.round((passedQuizIds.size / totalQuizzes) * 100));
  const quizzesScore = Math.round((quizzesPct * 20) / 100);

  const flashcardBoxes = progress.flashcardBoxes || {};
  const masteredFlashcards = Object.values(flashcardBoxes).filter(b => b >= 3).length;
  const flashcardTarget = Math.max(10, Math.round(totalQuestions * 0.4));
  const flashcardsPct = Math.min(100, Math.round((masteredFlashcards / flashcardTarget) * 100));
  const flashcardsScore = Math.round((flashcardsPct * 10) / 100);

  const hasLegend = Boolean(
    progress.savedLegend && 
    (progress.savedLegend.companyName || progress.savedLegend.roleTitle || progress.savedLegend.incidentStory)
  );
  const legendPct = hasLegend ? 100 : 0;
  const legendScore = hasLegend ? 10 : 0;

  const totalScore = Math.min(100, Math.max(0, theoryScore + incidentsScore + quizzesScore + flashcardsScore + legendScore));

  let levelTitle = 'DevOps Novice';
  let levelBadgeBg = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
  let levelTextColor = 'text-amber-500';

  if (totalScore >= 80) {
    levelTitle = 'Senior Ready';
    levelBadgeBg = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
    levelTextColor = 'text-emerald-500';
  } else if (totalScore >= 55) {
    levelTitle = 'Middle DevOps';
    levelBadgeBg = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30';
    levelTextColor = 'text-blue-500';
  } else if (totalScore >= 25) {
    levelTitle = 'Junior Candidate';
    levelBadgeBg = 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30';
    levelTextColor = 'text-indigo-500';
  }

  const pillars: ReadinessPillar[] = [
    {
      id: 'theory',
      label: 'Теория',
      pct: theoryPct,
      weightPct: 35,
      score: theoryScore,
      color: 'bg-blue-500',
      bgBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      badgeText: `${masteredCount}/${totalQuestions}`
    },
    {
      id: 'incidents',
      label: 'Аварии',
      pct: incidentsPct,
      weightPct: 25,
      score: incidentsScore,
      color: 'bg-rose-500',
      bgBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      badgeText: `${solvedIncidents}/${totalIncidents}`
    },
    {
      id: 'quizzes',
      label: 'Тесты',
      pct: quizzesPct,
      weightPct: 20,
      score: quizzesScore,
      color: 'bg-emerald-500',
      bgBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      badgeText: `${passedQuizIds.size}/${totalQuizzes}`
    },
    {
      id: 'legend',
      label: 'Легенда',
      pct: legendPct,
      weightPct: 10,
      score: legendScore,
      color: 'bg-purple-500',
      bgBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      badgeText: hasLegend ? '100%' : '0%'
    }
  ];

  // We only recommend the Career Legend if the user has reached a solid foundation of theory (at least 50%)
  const pillarsForRecommendation = pillars.filter(p => {
    if (p.id === 'legend') {
      return theoryPct >= 50;
    }
    return true;
  });

  const sortedByPct = [...pillarsForRecommendation].sort((a, b) => a.pct - b.pct);
  const lowestPillar = sortedByPct[0] || pillars[0];

  let recommendation = {
    title: 'Подтяните теорию',
    advice: 'Освойте новые темы Уровня 1 для сильной базы',
    targetTab: 'questions'
  };

  if (lowestPillar.id === 'incidents') {
    recommendation = {
      title: 'Фокус: Аварии Prod',
      advice: 'Решите разбор инцидента на Уровне 3 (+12% к готовности)',
      targetTab: 'incidents'
    };
  } else if (lowestPillar.id === 'quizzes') {
    recommendation = {
      title: 'Фокус: Собес-Тесты',
      advice: 'Пройдите итоговый тест с таймером на Уровне 2 (+10% к готовности)',
      targetTab: 'quizzes'
    };
  } else if (lowestPillar.id === 'legend') {
    recommendation = {
      title: 'Фокус: Карьерная Легенда',
      advice: 'Заполните проекты и резюме на Уровне 4 (+10% к готовности)',
      targetTab: 'legend'
    };
  } else if (lowestPillar.id === 'theory') {
    recommendation = {
      title: 'Фокус: Теоретическая база',
      advice: 'Отметьте изученные вопросы на Уровне 1 (+15% к готовности)',
      targetTab: 'questions'
    };
  }

  if (totalScore >= 85) {
    recommendation = {
      title: 'Высокая готовность!',
      advice: 'Отличная форма. Повторяйте карточки перед собеседованием.',
      targetTab: 'flashcards'
    };
  }

  return {
    totalScore,
    levelTitle,
    levelBadgeBg,
    levelTextColor,
    pillars,
    recommendation
  };
}
