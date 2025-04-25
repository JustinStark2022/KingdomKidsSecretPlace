import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
export const getUser = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!result.length)
        return res.status(404).json({ message: "User not found" });
    const { password, ...safeUser } = result[0];
    res.json(safeUser);
};
export const getChildren = async (req, res) => {
    const parentId = req.user?.id;
    const result = await db.select().from(users).where(eq(users.parentId, parentId));
    res.json(result);
};
export const createChild = async (req, res) => {
    const { username, password, email, display_name, role, firstName, lastName } = req.body;
    if (!username || !password || !display_name || !role || !firstName || !lastName) {
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
        parentId: req.user.id,
        firstName,
        lastName
    })
        .returning();
    res.status(201).json(newUser[0]);
};
