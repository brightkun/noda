import { Router } from "express";
import { getGraph } from "../controllers/graph.controller";

const router = Router();

router.get("/", getGraph);

export default router;
