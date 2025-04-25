// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/utils/token";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Zod-based type validation schema
const newUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
  display_name: z.string(),
  role: z.string(),
  parent_id: z.number().optional(),
  first_name: z.string(),
  last_name: z.string()
});

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 1000 * 60 * 60, // 1 hour
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = newUserSchema.parse(req.body);

    const {
      username,
      password,
      email,
      display_name,
      role,
      parent_id,
      first_name,
      last_name,
    } = parsed;

    // Check if username exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const inserted = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        email,
        display_name,
        role,
        parent_id: parent_id ?? null,
        first_name,
        last_name,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        display_name: users.display_name,
        role: users.role,
        parent_id: users.parent_id,
        first_name: users.first_name,
        last_name: users.last_name,
        created_at: users.created_at,
        password: users.password
      });

    const createdUser = inserted[0];

    const token = generateToken(createdUser.id, createdUser.role);

    res
      .cookie("token", token, COOKIE_OPTS)
      .status(201)
      .json({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        displayName: createdUser.display_name,
        role: createdUser.role,
        parentId: createdUser.parent_id,
        firstName: createdUser.first_name,
        lastName: createdUser.last_name,
        createdAt: createdUser.created_at,
        isParent: createdUser.role === "parent",
      });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = generateToken(user.id, user.role);

  res
    .cookie("token", token, COOKIE_OPTS)
    .json({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      parentId: user.parent_id,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      isParent: user.role === "parent",
    });
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "Logged out successfully." });
};

export const getMe = async (req: Request & { user?: { id: number } }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const [found] = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id));

  if (!found) {
    return res.status(404).json({ message: "User not found." });
  }

  const { password, ...safeUser } = found;
  res.json(safeUser);
};
