import { z } from "zod";

// Что приходит от клиента
export const answerBodySchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "Введите ответ")
    .max(4000, "Ответ слишком длинный"),
});

// Что должна вернуть модель
export const questionsOutputSchema = z.object({
  cards: z
    .array(
      z.object({
        question: z.string().trim().min(1),
        answer: z.string().trim().min(1),
      }),
    )
    .min(3)
    .max(5),
});

export const gradeOutputSchema = z.object({
  score: z.number().int().min(0).max(5),
  feedback: z.string().trim().min(1),
});

export type AnswerInput = z.infer<typeof answerBodySchema>;
