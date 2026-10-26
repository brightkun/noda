"use client";

import { X } from "lucide-react";
import { useNoteFilterStore } from "@/features/filter-notes";
import { Button } from "@/shared/ui/button";
import { KnowledgeGraph } from "@/widgets/knowledge-graph";

export const GraphPage = () => {
  const tag = useNoteFilterStore((state) => state.tag);
  const clearTag = useNoteFilterStore((state) => state.clearTag);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-4 px-8 py-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Граф знаний</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Клик по узлу открывает заметку. Фильтр по тегу выбирается в боковой панели.
          </p>
        </div>

        {tag && (
          <Button variant="outline" onClick={clearTag}>
            Тег #{tag}
            <X aria-hidden data-icon="inline-end" />
            <span className="sr-only">Сбросить фильтр</span>
          </Button>
        )}
      </header>

      <div className="min-h-0 flex-1 border-t">
        <KnowledgeGraph tag={tag} />
      </div>
    </div>
  );
};
