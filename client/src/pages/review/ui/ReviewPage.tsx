"use client";

import { ReviewQueue } from "@/widgets/review-queue";

export const ReviewPage = () => (
  <div className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-10">
    <header>
      <h1 className="text-3xl font-semibold tracking-tight">Повторить сегодня</h1>
      <p className="mt-2 text-muted-foreground">
        Ответьте на вопрос своими словами, ИИ оценит ответ по тексту заметки.
      </p>
    </header>
    <ReviewQueue />
  </div>
);
