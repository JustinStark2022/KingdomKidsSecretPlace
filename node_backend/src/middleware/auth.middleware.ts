// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken as decodeJWT } from "@/utils/token";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token; // ✅ Read from cookies

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = decodeJWT(token);
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
