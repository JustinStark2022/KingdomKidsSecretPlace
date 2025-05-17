import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env.node_backend" });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { z } from "zod";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bibleRoutes from "./routes/bible.routes";
import lessonsRoutes from "./routes/lessons.routes";
import alertsRoutes from "./routes/alerts.routes";
import chatRoutes from "./routes/chat.routes";
import friendsRoutes from "./routes/friends.routes";
import locationRoutes from "./routes/location.routes";
import screenTimeRoutes from "./routes/screenTime.routes";
import childDashboardRoutes from "@/routes/childDashboard.routes";
import gamesRoutes from "./routes/games.routes";

import { logger } from "./utils/logger";


// Environment variable validation
const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  FRONTEND_URL: z.string().default("http://client:5173"),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  logger.error("Environment variable validation failed:", error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_URL || "http://client:5173" // Allow localhost during development
    : process.env.FRONTEND_URL, // Use the environment variable in production
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Basic middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// API routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bible", bibleRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/screentime", screenTimeRoutes);
app.use("/api/child-dashboard", childDashboardRoutes);
app.use("/api/games", gamesRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
});