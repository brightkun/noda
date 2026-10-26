"use client";

import { useQuery } from "@tanstack/react-query";
import { noteApi } from "./noteApi";

// Префикс ["notes"] нужен, чтобы одной инвалидацией сбросить и список, и карточки
export const noteKeys = {
  all: ["notes"] as const,
  detail: (id: number) => ["notes", id] as const,
};

export const useNotes = () =>
  useQuery({ queryKey: noteKeys.all, queryFn: noteApi.list });

export const useNote = (id: number) =>
  useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => noteApi.get(id),
    enabled: Number.isInteger(id) && id > 0,
  });
