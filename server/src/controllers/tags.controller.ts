import { Request, Response } from "express";
import { DEMO_USER_ID } from "../config/demo";
import * as tagsService from "../services/tags.service";

export const getTags = async (req: Request, res: Response) => {
  res.json(await tagsService.listTags(DEMO_USER_ID));
};
