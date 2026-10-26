import { z } from "zod";

export const noteFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Введите название")
    .max(200, "Не длиннее 200 символов")
    .refine((title) => !/[[\]]/.test(title), "Нельзя использовать [ и ]"),
  body: z.string(),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
