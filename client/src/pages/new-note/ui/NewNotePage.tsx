"use client";

import { NoteForm } from "@/features/save-note";

export const NewNotePage = () => (
  <div className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-10">
    <h1 className="text-3xl font-semibold tracking-tight">Новая заметка</h1>
    <NoteForm />
  </div>
);
