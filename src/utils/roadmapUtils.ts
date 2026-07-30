import { CategoryId, Question, UserProgress } from '../types';
import { QUIZZES } from '../data/quizzes';
import { INCIDENT_SCENARIOS } from '../data/incidents';

export interface StageActivityStats {
  // Questions
  totalQuestions: number;
  masteredQuestions: number;
  questionsPercent: number;

  // Flashcards
  totalCards: number;
  reviewedCards: number;
  cardsPercent: number;

  // Quizzes
  totalQuizzes: number;
  passedQuizzes: number;
  quizzesPercent: number;

  // Incidents
  totalIncidents: number;
  solvedIncidents: number;
  incidentsPercent: number;

  // Combined weighted percent
  overallPercent: number;

  // Status
  status: 'completed' | 'in_progress' | 'unlocked';
  
  // Suggested next activity for this category
  recommendedActivity: {
    type: 'questions' | 'flashcards' | 'quizzes' | 'incidents';
    title: string;
    description: string;
    actionLabel: string;
  };
}

export function calculateStageActivityStats(
  catId: CategoryId,
  questions: Question[],
  progress: UserProgress
): StageActivityStats {
  // 1. Questions
  const catQuestions = questions.filter(q => q.category === catId);
  const totalQuestions = catQuestions.length;
  const masteredQuestions = catQuestions.filter(q => 
    progress.masteredQuestionIds.includes(q.id)
  ).length;
  const questionsPercent = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0;

  // 2. Flashcards
  const totalCards = totalQuestions;
  const reviewedCards = catQuestions.filter(q => {
    const box = progress.flashcardBoxes?.[q.id];
    return box !== undefined && box >= 2;
  }).length;
  const cardsPercent = totalCards > 0 ? Math.round((reviewedCards / totalCards) * 100) : 0;

  // 3. Quizzes
  const catQuizzes = QUIZZES.filter(q => q.category === catId);
  const totalQuizzes = catQuizzes.length;
  const passedQuizzes = catQuizzes.filter(quiz => {
    return (progress.quizResults || []).some(
      r => r.quizId === quiz.id && (r.passed || (r.score / r.totalQuestions) >= 0.6)
    );
  }).length;

  let quizzesPercent = 0;
  if (totalQuizzes > 0) {
    quizzesPercent = Math.round((passedQuizzes / totalQuizzes) * 100);
  } else {
    const generalQuizzesPassed = (progress.quizResults || []).filter(r => r.passed).length;
    quizzesPercent = generalQuizzesPassed > 0 ? Math.min(100, generalQuizzesPassed * 33) : Math.round(questionsPercent * 0.5);
  }

  // 4. Incidents
  const catIncidents = INCIDENT_SCENARIOS.filter(inc => inc.category === catId);
  const totalIncidents = catIncidents.length;
  const solvedIncidents = catIncidents.filter(inc => 
    (progress.solvedIncidentIds || []).includes(inc.id)
  ).length;

  let incidentsPercent = 0;
  if (totalIncidents > 0) {
    incidentsPercent = Math.round((solvedIncidents / totalIncidents) * 100);
  } else {
    incidentsPercent = Math.round(questionsPercent * 0.6);
  }

  // Combined overall percent with weights
  let weightedSum = 0;
  let totalWeight = 0;

  weightedSum += questionsPercent * 40;
  totalWeight += 40;

  weightedSum += cardsPercent * 20;
  totalWeight += 20;

  if (totalQuizzes > 0) {
    weightedSum += quizzesPercent * 20;
    totalWeight += 20;
  } else {
    weightedSum += quizzesPercent * 10;
    totalWeight += 10;
  }

  if (totalIncidents > 0) {
    weightedSum += incidentsPercent * 20;
    totalWeight += 20;
  } else {
    weightedSum += incidentsPercent * 10;
    totalWeight += 10;
  }

  const overallPercent = Math.min(100, Math.round(weightedSum / totalWeight));

  let status: 'completed' | 'in_progress' | 'unlocked' = 'unlocked';
  if (overallPercent >= 80) status = 'completed';
  else if (overallPercent > 0) status = 'in_progress';

  let recommendedActivity: StageActivityStats['recommendedActivity'];

  if (questionsPercent < 80) {
    recommendedActivity = {
      type: 'questions',
      title: 'Учить концепции и вопросы',
      description: `${masteredQuestions} из ${totalQuestions} вопросов освоено`,
      actionLabel: 'Разобрать вопросы'
    };
  } else if (cardsPercent < 80) {
    recommendedActivity = {
      type: 'flashcards',
      title: 'Повторить карточки',
      description: `${reviewedCards} из ${totalCards} карточек проработано`,
      actionLabel: 'Повторить карточки'
    };
  } else if (totalQuizzes > 0 && quizzesPercent < 80) {
    recommendedActivity = {
      type: 'quizzes',
      title: 'Пройти проверочный тест',
      description: `${passedQuizzes} из ${totalQuizzes} тестов сдано`,
      actionLabel: 'Пройти тест'
    };
  } else if (totalIncidents > 0 && incidentsPercent < 80) {
    recommendedActivity = {
      type: 'incidents',
      title: 'Устранить аварии в Prod',
      description: `${solvedIncidents} из ${totalIncidents} инцидентов решено`,
      actionLabel: 'Решить аварии'
    };
  } else {
    recommendedActivity = {
      type: 'questions',
      title: 'Этап полностью освоен!',
      description: 'Отличная работа, все 4 активности пройдены',
      actionLabel: 'Закрепить материал'
    };
  }

  return {
    totalQuestions,
    masteredQuestions,
    questionsPercent,
    totalCards,
    reviewedCards,
    cardsPercent,
    totalQuizzes,
    passedQuizzes,
    quizzesPercent,
    totalIncidents,
    solvedIncidents,
    incidentsPercent,
    overallPercent,
    status,
    recommendedActivity
  };
}
