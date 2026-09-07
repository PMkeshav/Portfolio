import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

const healthKartDirectory = fileURLToPath(
  new URL("../Healthkart_Project", import.meta.url),
);

function copyHealthKartDemo() {
  return {
    name: "copy-healthkart-demo",
    closeBundle() {
      cpSync(healthKartDirectory, "dist", { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyHealthKartDemo()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true,
      },
    },
  },
});
