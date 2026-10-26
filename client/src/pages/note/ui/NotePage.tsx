"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { TagList, useNote } from "@/entities/note";
import { DeleteNoteButton } from "@/features/delete-note";
import { GenerateQuestionsButton } from "@/features/generate-questions";
import { NoteForm } from "@/features/save-note";
import { getErrorMessage } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { NoteView } from "@/widgets/note-view";

export const NotePage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const { data: note, isPending, error } = useNote(id);
  const [isEditing, setIsEditing] = useState(false);

  if (isPending) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-8 py-10">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    );
  }

  if (error || !note) {
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;

    return (
      <div className="mx-auto max-w-3xl px-8 py-10">
        <p role="alert" className="text-destructive">
          {isNotFound ? "Заметка не найдена" : getErrorMessage(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{note.title}</h1>
        <TagList tags={note.tags} />
        {!isEditing && (
          <div className="mt-1 flex flex-wrap gap-2">
            <GenerateQuestionsButton noteId={note.id} />
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil aria-hidden />
              Редактировать
            </Button>
            <DeleteNoteButton noteId={note.id} title={note.title} />
          </div>
        )}
      </header>

      {isEditing ? (
        <NoteForm
          note={note}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <NoteView note={note} />
      )}
    </div>
  );
};
