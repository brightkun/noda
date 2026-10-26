"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { noteApi } from "@/entities/note";
import type { NoteInput } from "@/entities/note";

// noteId не передан - создаём заметку, передан - обновляем
export const useSaveNote = (noteId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NoteInput) =>
      noteId === undefined
        ? noteApi.create(input)
        : noteApi.update(noteId, input),
    // Заметка меняет список, теги и граф сразу, поэтому сбрасываем весь кэш
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
