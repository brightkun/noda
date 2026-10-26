"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cardApi } from "@/entities/card";
import { getErrorMessage } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";

export const GenerateQuestionsButton = ({ noteId }: { noteId: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => cardApi.generateQuestions(noteId),
    onSuccess: async (cards) => {
      await queryClient.invalidateQueries();
      toast.success(`Готово: ${cards.length} карточек для повторения`, {
        action: { label: "Повторить", onClick: () => router.push("/review") },
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <Button type="button" variant="secondary" onClick={() => mutate()} disabled={isPending}>
      {isPending ? <Loader2 aria-hidden className="animate-spin" /> : <Sparkles aria-hidden />}
      {isPending ? "ИИ составляет вопросы…" : "Сгенерировать вопросы"}
    </Button>
  );
};
