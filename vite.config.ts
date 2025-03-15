import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  base: "/components-radar",
  plugins: [react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["/favicon.ico", "/apple-touch-icon.png"],
      devOptions: {
        enabled: true, // Enables PWA in development
      },
      manifest: {
        name: "Components Radar",
        short_name: "Radar",
        description: "Track and manage UI components",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/components-radar",
        scope: "/components-radar",
        icons: [
          {
            src: "/components-radar/boxes.png",
            sizes: "512x512",
            type: "image/png",
          },
          // {
          //   src: "/components-radar/boxes.png",
          //   sizes: "512x512",
          //   type: "image/png",
          // },
        ],
        
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
