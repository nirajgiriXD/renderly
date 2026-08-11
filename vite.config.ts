import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/renderly/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // A single-screen editor: almost everything is needed for first paint, so
    // the one chunk worth deferring is the PNG rasteriser, which is imported
    // dynamically at the point of export.
    chunkSizeWarningLimit: 800,
  },
});
