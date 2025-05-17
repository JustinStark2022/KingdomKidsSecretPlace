import { Request, Response } from "express";
import { db } from "../db/db";
import { screen_time as screenTimeTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const getScreenTimeData = async (_req: Request, res: Response) => {
  res.json({
    usedTimeMinutes: 45,
    allowedTimeMinutes: 120,
    additionalRewardMinutes: 15,
    dailyLimits: {
      total: 120,
      gaming: 60,
      social: 30,
      educational: 30
    },
    usageToday: {
      total: 45,
      gaming: 20,
      social: 15,
      educational: 10
    },
    timeRewards: {
      fromScripture: 10,
      fromLessons: 5,
      fromChores: 0
    },
    schedule: [],
    blockedApps: []
  });
};

// New: get screen time for any user by ID
export const getScreenTimeForUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const [record] = await db
      .select()
      .from(screenTimeTable)
      .where(eq(screenTimeTable.user_id, userId));
    res.json(record || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch screen time for user", error: err });
  }
};

// New: update screen time limits for a user
export const updateScreenTime = async (req: Request, res: Response) => {
  try {
    let { userId, allowedTimeMinutes } = req.body as { userId: number; allowedTimeMinutes: number | string };

    // Convert to number and validate
    userId = Number(userId);
    allowedTimeMinutes = Number(allowedTimeMinutes);

    if (isNaN(userId) || isNaN(allowedTimeMinutes)) {
      return res.status(400).json({ message: "Invalid userId or allowedTimeMinutes" });
    }

    const [updated] = await db
      .update(screenTimeTable)
      .set({ daily_limits_total: allowedTimeMinutes })
      .where(eq(screenTimeTable.user_id, userId))
      .returning();

    if (!updated) return res.status(404).json({ message: "Screen time record not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update screen time", error: err });
  }
};

