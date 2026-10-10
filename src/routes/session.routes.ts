import { Router } from "express";

import {
  createSession,
  getSessionById,
  getSessions,
  updateSessionStatus,
} from "../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.post("/", createSession);

sessionRouter.get("/", getSessions);

sessionRouter.get("/:id", getSessionById);

sessionRouter.patch("/:id", updateSessionStatus);