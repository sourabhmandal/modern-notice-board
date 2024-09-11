import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    coverage: {
      reporter: ["text", "json"],
    },
  },
});
