import { http } from "@/shared/api/http";
import { AnswerResult, ReviewCard } from "../model/types";

export const cardApi = {
  today: async () => (await http.get<ReviewCard[]>("/review/today")).data,

  generateQuestions: async (noteId: number) =>
    (await http.post<ReviewCard[]>(`/notes/${noteId}/questions`)).data,

  answer: async (cardId: number, answer: string) =>
    (await http.post<AnswerResult>(`/cards/${cardId}/answer`, { answer })).data,
};
