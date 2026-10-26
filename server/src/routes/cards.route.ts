import { Router } from "express";
import * as cardsController from "../controllers/cards.controller";

const router = Router();

router.post("/:id/answer", cardsController.answerCard);

export default router;
