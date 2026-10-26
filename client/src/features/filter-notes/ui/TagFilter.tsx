"use client";

import { useTags } from "@/entities/tag";
import { cn } from "@/shared/lib/utils";
import { useNoteFilterStore } from "../model/useNoteFilterStore";

export const TagFilter = () => {
  const { data: tags } = useTags();
  const activeTag = useNoteFilterStore((state) => state.tag);
  const toggleTag = useNoteFilterStore((state) => state.toggleTag);

  if (!tags || tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Фильтр по тегу">
      {tags.map((tag) => {
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
