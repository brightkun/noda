import { Request, Response } from "express";
import {
  idParamsSchema,
  noteBodySchema,
  tagQuerySchema,
} from "../schemas/notes.schema";
import { DEMO_USER_ID } from "../config/demo";
import * as notesService from "../services/notes.service";

export const getNotes = async (req: Request, res: Response) => {
  const { tag } = tagQuerySchema.parse(req.query);

  res.json(await notesService.listNotes(DEMO_USER_ID, tag));
};

export const getNote = async (req: Request, res: Response) => {
  const { id } = idParamsSchema.parse(req.params);

  res.json(await notesService.getNote(DEMO_USER_ID, id));
};

export const createNote = async (req: Request, res: Response) => {
  const input = noteBodySchema.parse(req.body);

  res.status(201).json(await notesService.createNote(DEMO_USER_ID, input));
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = idParamsSchema.parse(req.params);
  const input = noteBodySchema.parse(req.body);

  res.json(await notesService.updateNote(DEMO_USER_ID, id, input));
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = idParamsSchema.parse(req.params);

  await notesService.deleteNote(DEMO_USER_ID, id);
  res.status(204).end();
};
