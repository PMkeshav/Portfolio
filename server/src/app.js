import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import contentRoutes from "./routes/contentRoutes.js";

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.json({
      ok: true,
      message: "Portfolio API is running",
      health: "/health",
      api: "/api",
    });
  });

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", contentRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export { createApp };
export default app;
