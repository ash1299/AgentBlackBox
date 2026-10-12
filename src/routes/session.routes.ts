import { Router } from "express";

import {
  createSession,
  getSessionById,
  getSessionEvents,
  getSessions,
  runReadOrderTool,
  updateSessionStatus,
} from "../controllers/session.controller";



export const sessionRouter = Router();

sessionRouter.post("/", createSession);

sessionRouter.get("/", getSessions);

sessionRouter.post("/:id/tools/read-order",runReadOrderTool);

sessionRouter.get("/:id", getSessionById);

sessionRouter.patch("/:id", updateSessionStatus);

sessionRouter.get("/:id/events", getSessionEvents);

