// node_backend/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// POST /api/auth/signup
export const registerUser = async (req, res) => {
  console.log("🔥 Register endpoint hit with:", req.body);

  try {
    const { username, email, password, displayName, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        displayName,
        role,
        isParent: role === 'parent',
        createdAt: new Date(),
      })
      .returning();

    res.status(201).json({ user: newUser[0] });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .then(res => res[0]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Return token and user profile (excluding password)
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/auth/me?username=demo_user
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username query param is required' });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .then(res => res[0]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};
