import crypto from "node:crypto";

export type SessionStatus =
  | "ACTIVE"
  | "COMPLETED";

export type AgentSession = {
  id: string;
  agentName: string;
  customerMessage: string;
  status: SessionStatus;
  startedAt: string;
};

const sessions: AgentSession[] = [];

export const createSessionRecord = (
  agentName: string,
  customerMessage: string
): AgentSession => {
  const session: AgentSession = {
    id: crypto.randomUUID(),
    agentName,
    customerMessage,
    status: "ACTIVE",
    startedAt: new Date().toISOString(),
  };

  sessions.push(session);

  return session;
};

export const getAllSessions = (): AgentSession[] => {
  return sessions;
};

export const findSessionById = (
  id: string
): AgentSession | undefined => {
  return sessions.find(
    (session) => session.id === id
  );
};

export const updateSessionStatusById = (
  id: string,
  status: SessionStatus
): AgentSession | undefined => {
  const session = findSessionById(id);

  if (!session) {
    return undefined;
  }

  session.status = status;

  return session;
};