import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import resultRoutes from "./routes/result.routes.js";
import universityRoutes from "./routes/university.routes.js";
import programRoutes from "./routes/program.routes.js";
import newsRoutes from "./routes/news.routes.js";
import analyzeRoutes from "./routes/analyze.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  // health check (deployment)
  app.get("/health", (req, res) => res.json({ ok: true }));

  // API
  app.use("/", authRoutes);              // /register, /login
  app.use("/users", userRoutes);         // /users/profile
  app.use("/results", resultRoutes);     // resource CRUD
  app.use("/universities", universityRoutes);
  app.use("/programs", programRoutes);
  app.use("/news", newsRoutes);
  app.use("/analyze", analyzeRoutes);    // UNT analysis

  // Frontend
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

