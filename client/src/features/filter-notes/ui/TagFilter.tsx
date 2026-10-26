"use client";

import { useTags } from "@/entities/tag";
import { cn } from "@/shared/lib/utils";
import { useNoteFilterStore } from "../model/useNoteFilterStore";

export const TagFilter = () => {
  const { data: tags } = useTags();
  const activeTag = useNoteFilterStore((state) => state.tag);
  const toggleTag = useNoteFilterStore((state) => state.toggleTag);

  if (!tags || tags.length === 0) return null;

  // Частые теги первыми: при десятках тегов сверху остаются самые полезные
  const sortedTags = [...tags].sort(
    (a, b) => b.notesCount - a.notesCount || a.name.localeCompare(b.name),
  );

  return (
    // max-h: блок тегов не вытесняет список заметок, остальное листается внутри
    <ul
      className="flex max-h-[5.5rem] flex-wrap gap-1.5 overflow-y-auto"
      aria-label="Фильтр по тегу"
    >
      {sortedTags.map((tag) => {
        const isActive = tag.name === activeTag;

        return (
          <li key={tag.name}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleTag(tag.name)}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              #{tag.name}
              <span className="opacity-70">{tag.notesCount}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
