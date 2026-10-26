export type ReviewCard = {
  id: number;
  noteId: number;
  noteTitle: string;
  question: string;
  dueAt: string;
};

export type AnswerResult = {
  // оценка AI от 0 до 5, от 3 ответ считается верным
  score: number;
  feedback: string;
  correctAnswer: string;
  nextDueAt: string;
};

export const PASS_SCORE = 3;
