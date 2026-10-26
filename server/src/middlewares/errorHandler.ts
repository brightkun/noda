import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isApiError } from "../utils/apiError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Некорректные данные",
      issues: err.issues,
    });
  }

  if (isApiError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
};
