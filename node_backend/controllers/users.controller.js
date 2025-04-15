import { db } from '../db/index.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// GET /api/users/getUsers
export const getUsers = async (_req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/users/getUserById?username=someuser
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
