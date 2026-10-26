"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, PartyPopper, XCircle } from "lucide-react";
import { PASS_SCORE, useReviewToday } from "@/entities/card";
import type { AnswerResult, ReviewCard } from "@/entities/card";
import { AnswerCardForm } from "@/features/review-card";
import { cn } from "@/shared/lib/utils";
import { formatDueIn } from "@/shared/lib/formatDue";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

type Checked = { card: ReviewCard; result: AnswerResult };

const ResultPanel = ({ card, result }: Checked) => {
  const isPassed = result.score >= PASS_SCORE;
  const Icon = isPassed ? CheckCircle2 : XCircle;

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <div
        className={cn(
          "flex items-center gap-2 font-medium",
          isPassed ? "text-success" : "text-destructive",
        )}
      >
        <Icon aria-hidden className="size-5" />
        Оценка {result.score} из 5
        <span className="text-sm font-normal text-muted-foreground">
          · следующее повторение {formatDueIn(result.nextDueAt)}
        </span>
      </div>

      <p>{result.feedback}</p>

      <div className="rounded-lg border bg-muted/40 p-4">
        <p className="mb-1 text-sm text-muted-foreground">Эталонный ответ на «{card.question}»</p>
        <p>{result.correctAnswer}</p>
      </div>
    </div>
  );
};

export const ReviewQueue = () => {
  const queryClient = useQueryClient();
  const { data: cards, isPending, isError } = useReviewToday();
  // Сессия повторения: после ответа карточка уходит из выдачи сервера,
  // поэтому пройденные запоминаем здесь, а не полагаемся на перезапрос
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const [checked, setChecked] = useState<Checked | null>(null);

  if (isPending) return <Skeleton className="h-64 w-full" />;

  if (isError) {
    return (
      <p role="alert" className="text-destructive">
        Не удалось загрузить карточки. Запущен ли сервер на :5000?
      </p>
    );
  }

  const current = cards.find((card) => !doneIds.includes(card.id));
  const total = doneIds.length + cards.filter((card) => !doneIds.includes(card.id)).length;

  const next = () => {
    if (!checked) return;
    setDoneIds((ids) => [...ids, checked.card.id]);
    setChecked(null);
    void queryClient.invalidateQueries();
  };

  if (!checked && !current) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
        <PartyPopper aria-hidden className="size-8 text-primary" />
        <h2 className="text-lg font-medium">
          {doneIds.length > 0 ? "На сегодня всё" : "Повторять пока нечего"}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {doneIds.length > 0
            ? `Вы прошли карточек: ${doneIds.length}. Остальные вернутся по расписанию.`
            : "Откройте заметку и нажмите «Сгенерировать вопросы», чтобы появились карточки."}
        </p>
        <Link
          href="/"
          className="text-sm text-primary underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          На главную
        </Link>
      </div>
    );
  }

  const card = checked?.card ?? current;
  if (!card) return null;

  return (
    <article className="flex flex-col gap-6 rounded-xl border bg-card p-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Карточка {Math.min(doneIds.length + 1, total)} из {total} · заметка{" "}
          <Link
            href={`/notes/${card.noteId}`}
            className="text-primary underline underline-offset-4"
          >
            {card.noteTitle}
          </Link>
        </p>
        <h2 className="text-xl font-medium">{card.question}</h2>
      </header>

      {checked ? (
        <>
          <ResultPanel card={checked.card} result={checked.result} />
          <div>
            <Button type="button" onClick={next} autoFocus>
              Дальше
            </Button>
          </div>
        </>
      ) : (
        // key: для каждой карточки форма создаётся заново и поле ответа очищается
        <AnswerCardForm
          key={card.id}
          cardId={card.id}
          onAnswered={(result) => setChecked({ card, result })}
        />
      )}
    </article>
  );
};
