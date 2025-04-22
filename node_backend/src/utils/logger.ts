// src/utils/logger.ts
import pino from "pino";

// create a pretty‐printing transport
export const logger = pino({
  transport: {
    target: "pino-pretty",   // matches the package name
    options: {
      colorize: true,         // turn on colors
      translateTime: "SYS:standard"
    }
  }
});
