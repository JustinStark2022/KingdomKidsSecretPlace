// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken as decodeJWT } from "@/utils/token";

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = decodeJWT(token);
    // attach to req.user for downstream controllers
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
