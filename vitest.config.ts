import { config } from "dotenv";
import { defineConfig } from "vitest/config";

config({ path: ".env.test" });

export default defineConfig({
  test: {
    environment: "jsdom",
    env: process.env,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
