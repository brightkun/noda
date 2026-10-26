"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFilteredNotes } from "@/features/filter-notes";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

export const NoteList = () => {
  const pathname = usePathname();
  const { notes, total, isPending, isError } = useFilteredNotes();

  if (isPending) {
    return (
      <div className="flex flex-col gap-2" aria-label="Загрузка заметок">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Не удалось загрузить заметки. Запущен ли сервер на :5000?
      </p>
    );
  }

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {total === 0 ? "Заметок пока нет." : "Ничего не найдено."}
      </p>
    );
  }

  return (
    <nav aria-label="Заметки" className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
      <ul className="flex flex-col gap-0.5">
        {notes.map((note) => {
          const href = `/notes/${note.id}`;
          const isActive = pathname === href;

          return (
            <li key={note.id}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block truncate rounded-md px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                {note.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
