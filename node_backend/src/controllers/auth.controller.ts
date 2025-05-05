// src/controllers/auth.controller.ts
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { generateToken } from "@/utils/token";

import { Request, Response } from "express";

import bcrypt from "bcrypt";

import { eq } from "drizzle-orm";

import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";

// Zod-based type validation schema
const newUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  display_name: z.string().min(1),
  role: z.enum(["parent", "child"]),
  parent_id: z.number().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1)
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
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

    // Check if email exists
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
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
        parent_id: role === "child" ? parent_id : null,
        first_name,
        last_name,
      })
      .returning() as Array<typeof users.$inferSelect>;
    const createdUser = inserted[0];
    const token = generateToken(createdUser.id, createdUser.role);

    res
      .cookie("token", token, COOKIE_OPTS)
      .status(201)
      .json({
        id: createdUser.id,
        role: createdUser.role,
        isParent: createdUser.role === "parent",
      });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    return res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password." });
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
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    return res.status(400).json({ message: err.message });
  }
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
