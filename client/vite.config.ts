import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "studysync.png"],
      manifest: {
        name: "StudySync",
        short_name: "StudySync",
        description: "A comprehensive study planner application",
        theme_color: "#6366f1",
        background_color: "#ffffff",
        icons: [
          {
            src: "studysync.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "studysync.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "studysync.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
  },
});
