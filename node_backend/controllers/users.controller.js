import { db } from '../db/index.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// ✅ GET /api/users/me — Return the logged-in user based on token
export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id))
    .then((rows) => rows[0]);

  if (!dbUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(dbUser);
};

// ✅ GET /api/users/getUsers — Get all users
export const getUsers = async (_req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET /api/users/getUserById?username=someuser
export const getUserById = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Missing username query param" });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .then((res) => res[0]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET /api/users/children — Get children for the logged-in parent
export const getChildrenForParent = async (req, res) => {
  try {
    const parentId = req.user?.id;

    if (!parentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const childUsers = await db
      .select()
      .from(users)
      .where(eq(users['parent_id'], parentId)); // ✅ fix: bracket notation

    res.status(200).json({ children: childUsers });
  } catch (error) {
    console.error("Error fetching child users:", error);
    res.status(500).json({ message: "Failed to fetch child users" });
  }
};

// ✅ POST /api/users/create-child — Parent creates a child account
export const createChildAccount = async (req, res) => {
  const parentId = req.user?.id;
  const { username, password, displayName } = req.body;

  if (!parentId) {
    return res.status(403).json({ message: "Unauthorized: Only parents can create child accounts" });
  }

  if (!username || !password || !displayName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .then(res => res[0]);

    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedUser = await db.insert(users).values({
      username,
      password: hashedPassword,
      displayName,
      role: "child",
      isParent: false,
      parentId,
      email: `${username}@child.local`, // ✅ Fills in required NOT NULL column
      createdAt: new Date()
    }).returning();

    res.status(201).json({ message: "Child account created", child: insertedUser[0] });
  } catch (error) {
    console.error("Error creating child account:", error);
    res.status(500).json({ message: "Failed to create child account" });
  }
};
