import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/utils/token";
// cookie settings: httpOnly, secure in prod, 1h expiry
const COOKIE_OPTS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60,
};
export const registerUser = async (req, res) => {
    // cast incoming body to your insert type
    const { username, password, email, displayName, role, parentId, firstName, lastName, } = req.body;
    // basic validation
    if (!username ||
        !password ||
        !email ||
        !displayName ||
        !role ||
        !firstName ||
        !lastName) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    // ensure unique username
    const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
    if (existing.length > 0) {
        return res.status(400).json({ message: "Username already taken." });
    }
    // hash & insert
    const hashed = await bcrypt.hash(password, 10);
    const [created] = await db
        .insert(users)
        .values({
        username,
        password: hashed,
        email,
        displayName,
        role,
        parentId: parentId ?? null,
        firstName,
        lastName,
        // if you want to mark parents explicitly:
        isParent: role === "parent",
    })
        .returning();
    // issue JWT
    const token = generateToken(created.id, created.role);
    // set cookie & respond with safe user (Drizzle's `created` already omits nothing,
    // so we’re returning everything *except* password client‑side)
    res
        .cookie("token", token, COOKIE_OPTS)
        .status(201)
        .json({
        id: created.id,
        username: created.username,
        email: created.email,
        displayName: created.displayName,
        role: created.role,
        parentId: created.parentId,
        firstName: created.firstName,
        lastName: created.lastName,
        createdAt: created.createdAt,
        isParent: created.isParent,
    });
};
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    // fetch user
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
    // verify
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials." });
    }
    // issue JWT
    const token = generateToken(user.id, user.role);
    // set cookie & return safe user
    res
        .cookie("token", token, COOKIE_OPTS)
        .json({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        parentId: user.parentId,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        isParent: user.isParent,
    });
};
export const logoutUser = (_req, res) => {
    res
        .clearCookie("token")
        .json({ message: "Logged out successfully." });
};
export const getMe = async (req, res) => {
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
    // never send password hash
    const { password: _p, ...safe } = found;
    res.json(safe);
};
