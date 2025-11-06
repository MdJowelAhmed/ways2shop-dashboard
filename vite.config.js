import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: "10.10.7.48",
    host: "172.252.13.77",
    port: 4173,
  },
});
