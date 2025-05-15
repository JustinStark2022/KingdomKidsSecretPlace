import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Explicitly load .env.client from the root directory
  const env = loadEnv(mode, process.cwd(), ".env.client");

  return {
    server: {
      host: true, // Expose the server to the local network
      port: parseInt(env.PORT || "5173"), // Use the port from .env.client or default to 5173
      strictPort: true, // Fail if the port is already in use
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://backend:5000", // Proxy API requests to the backend
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Origin", env.VITE_FRONTEND_URL || "http://client:5173");
            });
          },
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"), // Output frontend build files to the "dist" directory
      emptyOutDir: true, // Clear the output directory before building
      sourcemap: mode === "development", // Generate sourcemaps in development mode
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"], // Separate vendor libraries
            ui: ["@radix-ui/react-*"], // Separate UI libraries
          },
        },
      },
    },
    plugins: [react()], // Add React plugin for Vite
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // Alias for the "src" directory
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), // Define environment-specific variables
    },
  };
});