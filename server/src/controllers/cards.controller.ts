import { Request, Response } from "express";
import { answerBodySchema } from "../schemas/cards.schema";
import { idParamsSchema } from "../schemas/notes.schema";
import { DEMO_USER_ID } from "../config/demo";
import * as cardsService from "../services/cards.service";

export const generateQuestions = async (req: Request, res: Response) => {
  const { id } = idParamsSchema.parse(req.params);

  res
    .status(201)
    .json(await cardsService.generateQuestions(DEMO_USER_ID, id));
};

export const answerCard = async (req: Request, res: Response) => {
  const { id } = idParamsSchema.parse(req.params);
  const { answer } = answerBodySchema.parse(req.body);

  res.json(await cardsService.answerCard(DEMO_USER_ID, id, answer));
};
