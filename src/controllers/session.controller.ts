import {
  type Request,
  type Response,
} from "express";

import {
  createSessionRecord,
  findSessionById,
  getAllSessions,
  updateSessionStatusById,
  type SessionStatus,
} from "../services/session.service";

import {
  getEventsBySessionId,
  recordEvent,
} from "../services/event.service";

export const createSession = (
  req: Request,
  res: Response
) => {
  const { agentName, customerMessage } = req.body;

  if (!agentName || !customerMessage) {
    return res.status(400).json({
      error:
        "agentName and customerMessage are required",
    });
  }

  const session = createSessionRecord(
    agentName,
    customerMessage
  );
  recordEvent(
  session.id,
  "SESSION_STARTED",
  {
    agentName: session.agentName,
  }
);

recordEvent(
  session.id,
  "USER_MESSAGE_RECEIVED",
  {
    message: session.customerMessage,
  }
);

  return res.status(201).json({
    message: "Agent session created",
    session,
  });
};

export const getSessions = (
  _req: Request,
  res: Response
) => {
  const sessions = getAllSessions();

  return res.status(200).json({
    count: sessions.length,
    sessions,
  });
};

export const getSessionById = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  const session = findSessionById(id);

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
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (
    status !== "ACTIVE" &&
    status !== "COMPLETED"
  ) {
    return res.status(400).json({
      error:
        "status must be ACTIVE or COMPLETED",
    });
  }

  const session = updateSessionStatusById(
    id,
    status as SessionStatus
  );

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  return res.status(200).json({
    message: "Session updated",
    session,
  });
};

export const getSessionEvents = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  const session = findSessionById(id);

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  const events = getEventsBySessionId(id);

  return res.status(200).json({
    sessionId: id,
    count: events.length,
    events,
  });
};