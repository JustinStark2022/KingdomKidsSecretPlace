// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ message: "Unauthorized" });

  const result = await db.select().from(users).where(eq(users.id, user_id)).limit(1);
  if (!result.length) return res.status(404).json({ message: "User not found" });

  const { password, ...safeUser } = result[0];
  res.json(safeUser);
};

export const getChildren = async (req: AuthenticatedRequest, res: Response) => {
  const parent_id = req.user?.id;
  const result = await db.select().from(users).where(eq(users.parent_id, parent_id));
  res.json(result);
};

export const createChild = async (req: AuthenticatedRequest, res: Response) => {
  const {
    username,
    password,
    email,
    display_name,
    role,
    first_name,
    last_name
  } = req.body;

  const parent_id = req.user?.id;
  if (!parent_id || !username || !password || !display_name || !role || !first_name || !last_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
    .insert(users)
    .values({
      username,
      password: hashedPassword,
      email,
      display_name,
      role,
      parent_id,
      first_name,
      last_name
    })
    .returning();

  if (!Array.isArray(newUser) || newUser.length === 0) {
    return res.status(500).json({ message: "Failed to create user" });
  }

  res.status(201).json(newUser[0]);
};
