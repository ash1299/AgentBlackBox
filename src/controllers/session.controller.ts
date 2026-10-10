import crypto from "node:crypto";
import {
  type Request,
  type Response,
} from "express";

type AgentSession = {
  id: string;
  agentName: string;
  customerMessage: string;
  status: "ACTIVE" | "COMPLETED";
  startedAt: string;
};

const sessions: AgentSession[] = [];

export const createSession = (
  req: Request,
  res: Response
) => {
  const { agentName, customerMessage } = req.body;

  if (!agentName || !customerMessage) {
    return res.status(400).json({
      error: "agentName and customerMessage are required",
    });
  }

  const session: AgentSession = {
    id: crypto.randomUUID(),
    agentName,
    customerMessage,
    status: "ACTIVE",
    startedAt: new Date().toISOString(),
  };

  sessions.push(session);

  return res.status(201).json({
    message: "Agent session created",
    session,
  });
};

export const getSessions = (
  _req: Request,
  res: Response
) => {
  return res.status(200).json({
    count: sessions.length,
    sessions,
  });
};

export const getSessionById = (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const session = sessions.find(
    (session) => session.id === id
  );

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  return res.status(200).json({
    session,
  });
};

export const updateSessionStatus = (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  const session = sessions.find(
    (session) => session.id === id
  );

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  if (
    status !== "ACTIVE" &&
    status !== "COMPLETED"
  ) {
    return res.status(400).json({
      error: "status must be ACTIVE or COMPLETED",
    });
  }

  session.status = status;

  return res.status(200).json({
    message: "Session updated",
    session,
  });
};