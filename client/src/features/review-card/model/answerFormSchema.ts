import { z } from "zod";

export const answerFormSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "Напишите ответ")
    .max(4000, "Не длиннее 4000 символов"),
});

export type AnswerFormValues = z.infer<typeof answerFormSchema>;
