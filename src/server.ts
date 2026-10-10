import "dotenv/config";

import express, {
  type Request,
  type Response,
} from "express";

import { sessionRouter } from "./routes/session.routes";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "AgentBlackBox API",
  });
});

app.use("/api/sessions", sessionRouter);

app.listen(PORT, () => {
  console.log(
    `AgentBlackBox API running on http://localhost:${PORT}`
  );
});