import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import contentRoutes from "./routes/contentRoutes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }

        const isConfiguredOrigin = origin === env.clientOrigin;
        const isLocalDevOrigin =
          /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

        if (isConfiguredOrigin || isLocalDevOrigin) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin not allowed by CORS"));
      },
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", contentRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
