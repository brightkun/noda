import { z } from "zod";

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const noteBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Название не может быть пустым")
    .max(200)
    .refine((title) => !/[[\]]/.test(title), "В названии нельзя использовать [ и ]"),
  body: z.string().default(""),
});

export const tagQuerySchema = z.object({
  tag: z.string().trim().toLowerCase().optional(),
});

export type NoteInput = z.infer<typeof noteBodySchema>;
