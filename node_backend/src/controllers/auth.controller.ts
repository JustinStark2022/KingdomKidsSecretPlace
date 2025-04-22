// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/utils/token";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60, // 1h
};

export const registerUser = async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    display_name,
    role,
    parentId,
    firstName,
    lastName,
  } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    !display_name ||
    !role ||
    !firstName ||
    !lastName
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (existing.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      password: hashedPassword,
      email,
      display_name,
      role,
      parentId: parentId || null,
      firstName,
      lastName,
    })
    .returning();

  const token = generateToken(newUser.id, newUser.role);

  // set token cookie
  res
    .cookie("token", token, COOKIE_OPTS)
    .status(201)
    .json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      display_name: newUser.display_name,
      role: newUser.role,
      parentId: newUser.parentId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id, user.role);

  res
    .cookie("token", token, COOKIE_OPTS)
    .json({
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
      parentId: user.parentId,
      firstName: user.firstName,
      lastName: user.lastName,
    });
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password, ...safeUser } = user;
  res.json(safeUser);
};
