import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes the build path-independent, so it works on
// GitHub Pages project sites (username.github.io/road-to-ubt/)
// and on any custom domain without changes.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
