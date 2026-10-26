import { Router } from "express";
import * as cardsController from "../controllers/cards.controller";
import * as notesController from "../controllers/notes.controller";

const router = Router();

router.get("/", notesController.getNotes);
router.get("/:id", notesController.getNote);
router.post("/", notesController.createNote);
router.put("/:id", notesController.updateNote);
router.delete("/:id", notesController.deleteNote);
router.post("/:id/questions", cardsController.generateQuestions);

export default router;
