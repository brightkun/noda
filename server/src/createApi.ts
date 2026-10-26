import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import notesRouter from "./routes/notes.route";
import graphRouter from "./routes/graph.route";
import tagsRouter from "./routes/tags.route";
import reviewRouter from "./routes/review.route";
import cardsRouter from "./routes/cards.route";

// CORS не нужен: Next проксирует /api/* на Express через rewrites
const createApi = () => {
  const app = express();
  app.use(express.json());

  app.use("/api/notes", notesRouter);
  app.use("/api/graph", graphRouter);
  app.use("/api/tags", tagsRouter);
  app.use("/api/review", reviewRouter);
  app.use("/api/cards", cardsRouter);

  app.use(errorHandler);
  return app;
};

export default createApi;
