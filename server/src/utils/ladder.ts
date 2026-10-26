// Упрощённая лесенка интервалов на показ (SM-2 позже). Дни до следующего повторения.
const LADDER = [1, 3, 7] as const;

// Оценка от 3 и выше считается верным ответом
export const PASS_SCORE = 3;

// Верный ответ поднимает карточку на ступень выше, неверный возвращает на 1 день.
// currentDays = 0 у новой карточки.
export const nextIntervalDays = (currentDays: number, score: number): number => {
  const first = LADDER[0];

  if (score < PASS_SCORE) return first;

  return LADDER.find((step) => step > currentDays) ?? LADDER[LADDER.length - 1] ?? first;
};
