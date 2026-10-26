import { Request, Response } from "express";
import { DEMO_USER_ID } from "../config/demo";
import * as reviewService from "../services/review.service";

export const getToday = async (req: Request, res: Response) => {
  res.json(await reviewService.getTodayCards(DEMO_USER_ID));
};
