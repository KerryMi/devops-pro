import { QuizQuestion } from '../types';

/**
 * Shuffles the options of a QuizQuestion while maintaining the correct answer reference.
 */
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  const optionsWithOriginalIndex = question.options.map((text, index) => ({
    text,
    isCorrect: index === question.correctAnswerIndex,
  }));

  // Fisher-Yates shuffle
  for (let i = optionsWithOriginalIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithOriginalIndex[i], optionsWithOriginalIndex[j]] = [optionsWithOriginalIndex[j], optionsWithOriginalIndex[i]];
  }

  const newCorrectIndex = optionsWithOriginalIndex.findIndex((opt) => opt.isCorrect);

  return {
    ...question,
    options: optionsWithOriginalIndex.map((opt) => opt.text),
    correctAnswerIndex: newCorrectIndex,
  };
}
