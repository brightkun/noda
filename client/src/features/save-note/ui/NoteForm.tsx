"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Note } from "@/entities/note";
import { getErrorMessage } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { noteFormSchema, NoteFormValues } from "../model/noteFormSchema";
import { useSaveNote } from "../model/useSaveNote";

type NoteFormProps = {
  // без note форма создаёт новую заметку
  note?: Note;
  onCancel?: () => void;
  // без onSaved после сохранения переходим на страницу заметки
  onSaved?: () => void;
};

export const NoteForm = ({ note, onCancel, onSaved }: NoteFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useSaveNote(note?.id);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { title: note?.title ?? "", body: note?.body ?? "" },
  });

  const onSubmit = (values: NoteFormValues) => {
    mutate(values, {
      onSuccess: (saved) => {
        toast.success("Заметка сохранена");
        // router.push на тот же URL страницу не перемонтирует, поэтому
        // со страницы заметки выходим из редактирования через onSaved
        if (onSaved) onSaved();
        else router.push(`/notes/${saved.id}`);
      },
      onError: (err) => {
        // 409 значит, что заметка с таким названием уже есть: показываем у поля
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setError("title", { message: getErrorMessage(err) });
          return;
        }
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-title" className="text-sm font-medium">
          Название
        </label>
        <Input
          id="note-title"
          autoFocus={!note}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "note-title-error" : undefined}
          placeholder="Например, Замыкания"
          {...register("title")}
        />
        {errors.title && (
          <p id="note-title-error" role="alert" className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-body" className="text-sm font-medium">
          Текст (markdown)
        </label>
        <Textarea
          id="note-body"
          rows={18}
          className="min-h-80 font-mono text-sm leading-relaxed"
          placeholder={
            "Пишите в markdown. Ссылка на другую заметку: [[Название]]. Тег: #react"
          }
          {...register("body")}
        />
        <p className="text-xs text-muted-foreground">
          [[Название]] создаёт связь в графе, #тег добавляет тег.
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Сохраняю…" : "Сохранить"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel ?? (() => router.back())}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};
