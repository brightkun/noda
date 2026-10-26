import { http } from "@/shared/api/http";
import { Note, NoteInput, NoteListItem } from "../model/types";

export const noteApi = {
  list: async () => (await http.get<NoteListItem[]>("/notes")).data,

  get: async (id: number) => (await http.get<Note>(`/notes/${id}`)).data,

  create: async (input: NoteInput) =>
    (await http.post<Note>("/notes", input)).data,

  update: async (id: number, input: NoteInput) =>
    (await http.put<Note>(`/notes/${id}`, input)).data,

  remove: async (id: number) => {
    await http.delete(`/notes/${id}`);
  },
};
