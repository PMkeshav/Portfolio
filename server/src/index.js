import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

connectDb()
  .then((connected) => {
    if (!connected) {
      console.warn(
        `MongoDB unavailable at ${env.mongodbUri}. Starting API with in-memory seeded content.`,
      );
    }

    app.listen(env.port, env.host, () => {
      console.log(`API listening on http://${env.host}:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
