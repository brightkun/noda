"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cardApi } from "@/entities/card";
import type { AnswerResult } from "@/entities/card";
import { getErrorMessage } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { answerFormSchema, AnswerFormValues } from "../model/answerFormSchema";

type AnswerCardFormProps = {
  cardId: number;
  onAnswered: (result: AnswerResult) => void;
};

export const AnswerCardForm = ({ cardId, onAnswered }: AnswerCardFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { answer: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: AnswerFormValues) => cardApi.answer(cardId, values.answer),
    onSuccess: onAnswered,
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const onSubmit = handleSubmit((values) => mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="card-answer" className="text-sm font-medium">
          Ваш ответ
        </label>
        <Textarea
          id="card-answer"
          rows={6}
          autoFocus
          disabled={isPending}
          aria-invalid={!!errors.answer}
          aria-describedby={errors.answer ? "card-answer-error" : undefined}
          placeholder="Ответьте своими словами. Ctrl+Enter отправляет."
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              void onSubmit();
            }
          }}
          {...register("answer")}
        />
        {errors.answer && (
          <p id="card-answer-error" role="alert" className="text-sm text-destructive">
            {errors.answer.message}
          </p>
        )}
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 aria-hidden className="animate-spin" />}
          {isPending ? "ИИ проверяет ответ…" : "Проверить ответ"}
        </Button>
      </div>
    </form>
  );
};
