"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { useNoteFilterStore } from "../model/useNoteFilterStore";

export const NoteSearchInput = () => {
  const query = useNoteFilterStore((state) => state.query);
  const setQuery = useNoteFilterStore((state) => state.setQuery);

  return (
    <div className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label="Поиск по названию заметки"
        placeholder="Поиск заметок"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-9 pl-8"
      />
    </div>
  );
};
