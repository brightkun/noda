import axios from "axios";

// Next проксирует /api/* на Express (rewrites в next.config.ts)
export const http = axios.create({ baseURL: "/api" });

// В catch ошибка приходит как unknown, поэтому сначала сужаем тип
export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? err.message;
  }

  return err instanceof Error ? err.message : "Неизвестная ошибка";
};
