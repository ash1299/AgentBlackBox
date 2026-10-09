import "dotenv/config";
import express, { type Request, type Response } from "express";
import crypto from "node:crypto";
const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

type AgentSession = {
  id: string;
  agentName: string;
  customerMessage: string;
  status: "ACTIVE"| "COMPLETED";
  startedAt: string;
};
const sessions: AgentSession[] = [];

app.post("/api/sessions", (req: Request, res: Response) => {
  const { agentName, customerMessage } = req.body;

    if (!agentName || !customerMessage) {
    return res.status(400).json({
      error: "agentName and customerMessage are required",
    });
  }

  const session: AgentSession  = {
    id: crypto.randomUUID(),
    agentName,
    customerMessage,
    status: "ACTIVE",
    startedAt: new Date().toISOString(),
  };
  sessions.push(session);

  res.status(201).json({
    message: "Agent session created",
    session,
  });
});
app.get("/api/sessions", (_req: Request, res: Response) => {
  res.status(200).json({
    count: sessions.length,
    sessions,
  });
});
app.get("/api/sessions/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const session = sessions.find((session) => session.id === id);

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  res.status(200).json({
    session,
  });
});



app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "AgentBlackBox API",
  });
});

app.patch("/api/sessions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const session = sessions.find((session) => session.id === id);

  if (!session) {
    return res.status(404).json({
      error: "Session not found",
    });
  }

  if (status !== "ACTIVE" && status !== "COMPLETED") {
    return res.status(400).json({
      error: "status must be ACTIVE or COMPLETED",
    });
  }

  session.status = status;

  res.status(200).json({
    message: "Session updated",
    session,
  });
});

app.listen(PORT, () => {
  console.log(`AgentBlackBox API running on http://localhost:${PORT}`);
});