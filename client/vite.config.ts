// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Explicitly load .env.client from the root directory
  const env = loadEnv(mode, process.cwd(), ".env.client");

  return {
    server: {
      port: parseInt(env.PORT || "5173"),
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000", // Proxy API requests to the backend
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Origin", env.VITE_FRONTEND_URL || "http://localhost:5173");
            });
          },
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"), // Output frontend build files to the "dist" directory
      emptyOutDir: true,
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["@radix-ui/react-*"],
          },
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // Alias for the "src" directory
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});