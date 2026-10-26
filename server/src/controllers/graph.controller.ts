import { Request, Response } from "express";
import { tagQuerySchema } from "../schemas/notes.schema";
import { DEMO_USER_ID } from "../config/demo";
import * as graphService from "../services/graph.service";

export const getGraph = async (req: Request, res: Response) => {
  const { tag } = tagQuerySchema.parse(req.query);

  res.json(await graphService.getGraph(DEMO_USER_ID, tag));
};
