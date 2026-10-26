import { Router } from "express";
import { getToday } from "../controllers/review.controller";

const router = Router();

router.get("/today", getToday);

export default router;
