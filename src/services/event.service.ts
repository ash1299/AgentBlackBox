import crypto from "node:crypto";

export type AgentEventType =
  | "SESSION_STARTED"
  | "USER_MESSAGE_RECEIVED"
  | "TOOL_REQUESTED"
  | "TOOL_EXECUTED"
  | "TOOL_FAILED";

export type AgentEvent = {
  id: string;
  sessionId: string;
  type: AgentEventType;
  timestamp: string;
  data: Record<string, unknown>;
};

const events: AgentEvent[] = [];

export const recordEvent = (
  sessionId: string,
  type: AgentEventType,
  data: Record<string, unknown> = {}
): AgentEvent => {
  const event: AgentEvent = {
    id: crypto.randomUUID(),
    sessionId,
    type,
    timestamp: new Date().toISOString(),
    data,
  };

  events.push(event);

  return event;
};

export const getEventsBySessionId = (
  sessionId: string
): AgentEvent[] => {
  return events.filter(
    (event) => event.sessionId === sessionId
  );
};