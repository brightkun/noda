"use client";

import { useMemo } from "react";
import { useNotes } from "@/entities/note";
import { useNoteFilterStore } from "./useNoteFilterStore";

export const useFilteredNotes = () => {
  const { data, ...rest } = useNotes();
  const query = useNoteFilterStore((state) => state.query);
  const tag = useNoteFilterStore((state) => state.tag);

  const notes = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return (data ?? []).filter(
      (note) =>
        (!tag || note.tags.includes(tag)) &&
        (!needle || note.title.toLowerCase().includes(needle)),
    );
  }, [data, query, tag]);

  return { ...rest, notes, total: data?.length ?? 0 };
};
