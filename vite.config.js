import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // We register the SW ourselves in main.jsx so we can check for new deploys
      // on load and reload once when the new build takes control. The default
      // injected script only calls register() — no update check — which let a
      // cached build stick until a manual hard-refresh.
      injectRegister: false,
      includeAssets: [
        "favicon-32.png",
        "apple-touch-icon.png",
        "icon-192.png",
        "icon-512.png",
        "icon-maskable-512.png",
      ],
      manifest: {
        name: "Lingua",
        short_name: "Lingua",
        display: "standalone",
        background_color: "#F1EDE2",
        theme_color: "#2A4A7B",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
});
