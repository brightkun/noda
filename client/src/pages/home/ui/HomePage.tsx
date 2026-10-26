"use client";

import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { useGraph } from "@/entities/graph";
import { useNotes } from "@/entities/note";
import { TagList } from "@/entities/note";
import { useReviewToday } from "@/entities/card";
import { useTags } from "@/entities/tag";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

const RECENT_COUNT = 6;

const Stat = ({
  label,
  value,
}: {
  label: string;
  value: number | undefined;
}) => (
  <div className="rounded-xl border bg-card p-4">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="mt-1 text-3xl font-semibold tabular-nums">
      {value ?? <Skeleton className="mt-2 h-7 w-10" />}
    </dd>
  </div>
);

export const HomePage = () => {
  const { data: notes, isPending, isError } = useNotes();
  const { data: tags } = useTags();
  const { data: graph } = useGraph(null);
  const { data: dueCards } = useReviewToday();
  const dueCount = dueCards?.length ?? 0;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Ваша база знаний</h1>
        <p className="mt-2 text-muted-foreground">
          Заметки в markdown, связи через [[ссылки]] и граф, который растёт вместе с ними.
        </p>
      </header>

      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Заметок" value={notes?.length} />
        <Stat label="Связей" value={graph?.links.length} />
        <Stat label="Тегов" value={tags?.length} />
      </dl>

      <section
        aria-labelledby="review-title"
        className="flex items-start gap-4 rounded-xl border p-5"
      >
        <BrainCircuit aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="flex-1">
          <h2 id="review-title" className="font-medium">
            Повторить сегодня
          </h2>
          {dueCount > 0 ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Карточек к повторению: {dueCount}. ИИ оценит ваши ответы.
              </p>
              <Link
                href="/review"
                className={cn(buttonVariants({ size: "lg" }), "mt-3")}
              >
                Начать повторение
              </Link>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              На сегодня карточек нет. Откройте заметку и нажмите «Сгенерировать
              вопросы».
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="recent-title">
        <h2 id="recent-title" className="mb-3 font-medium">
          Недавние заметки
        </h2>

        {isPending && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p role="alert" className="text-sm text-destructive">
            Не удалось загрузить заметки. Запущен ли сервер на :5000?
          </p>
        )}

        {notes && notes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Заметок пока нет.{" "}
            <Link href="/notes/new" className="text-primary underline underline-offset-4">
              Создайте первую
            </Link>
            .
          </p>
        )}

        {notes && notes.length > 0 && (
          <ul className="flex flex-col gap-2">
            {notes.slice(0, RECENT_COUNT).map((note) => (
              <li key={note.id}>
                <Link
                  href={`/notes/${note.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="truncate font-medium">{note.title}</span>
                  <TagList tags={note.tags} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
