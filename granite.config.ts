import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "harufriend",
  brand: {
    displayName: "하루",
    primaryColor: "#9333EA",
    icon: "./public/haru-icon-1024.png",
  },
  web: {
    host: "0.0.0.0",
    port: 5173,
    commands: {
      dev: "vite",
      build: "tsc -b && vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
