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

import {
  executeTool,
} from "../services/tool.gateway";

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

export const runReadOrderTool = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const { orderId } = req.body;

  const session = findSessionById(id);

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({
      error: "orderId is required",
    });
  }

  recordEvent(
    id,
    "TOOL_REQUESTED",
    {
      tool: "read_order",
      orderId,
    }
  );

  const result = executeTool(
    id,
    "read_order",
    { orderId }
  );

  if (!result.success) {
    if (result.error === "POLICY_BLOCKED") {
     return res.status(403).json({
      error: "Tool execution blocked by policy",
     });
    }
    
    if (result.error === "INVALID_INPUT") {
      return res.status(400).json({
        error: "orderId must be provided as a string",
      });
    }

    if (result.error === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.status(400).json({
      error: "Unsupported tool",
    });
  }

  return res.status(200).json({
    message: "Tool executed successfully",
    tool: result.tool,
    result: result.result,
  });
};