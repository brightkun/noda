"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { noteApi, noteKeys } from "@/entities/note";
import { getErrorMessage } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";

export const DeleteNoteButton = ({
  noteId,
  title,
}: {
  noteId: number;
  title: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => noteApi.remove(noteId),
    onSuccess: async () => {
      const deletedKey = noteKeys.detail(noteId);

      router.push("/");
      // Сбрасываем всё, кроме карточки удалённой заметки: пока страница не
      // размонтировалась, её перезапрос дал бы 404. Из кэша её просто убираем.
      await queryClient.invalidateQueries({
        predicate: (query) =>
          !(query.queryKey[0] === deletedKey[0] && query.queryKey[1] === deletedKey[1]),
      });
      queryClient.removeQueries({ queryKey: deletedKey });
      toast.success("Заметка удалена");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const onClick = () => {
    if (window.confirm(`Удалить заметку «${title}»? Связи с ней тоже пропадут.`)) {
      mutate();
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={onClick}
      disabled={isPending}
    >
      <Trash2 aria-hidden />
      Удалить
    </Button>
  );
};
